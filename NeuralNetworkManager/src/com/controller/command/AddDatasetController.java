/* 
 * Copyright 2017 Luca Bartolomei <bartn8@hotmal.it>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.controller.command;

import com.model.db.DBConnection;
import com.model.db.table.tables.Dataset;
import com.model.db.table.tables.Filtro;
import com.model.db.table.tables.Preset;
import com.model.db.table.tables.Rete;
import com.model.db.table.tables.util.NeuralModelConverter;
import com.model.db.table.tables.util.PresetHiddenLayerConverter;
import com.model.db.table.tables.util.PresetPluginsConverter;
import com.model.db.table.tables.wrapper.WrapperDataset;
import com.model.db.table.tables.wrapper.WrapperFiltro;
import com.model.db.table.tables.wrapper.WrapperPreset;
import com.model.db.table.tables.wrapper.WrapperRete;
import com.model.neural.NeuralNetworkManager;
import com.model.neural.image.ImageDatasetParser;
import com.model.neural.image.map.ImageFilters;
import com.model.protocol.request.wrapper.Image64Wrapper;
import com.model.protocol.request.wrapper.Point64Wrapper;
import com.model.protocol.response.ServerResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.neuroph.core.data.DataSet;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class AddDatasetController {

    private static final Logger LOG = Logger.getLogger(AddDatasetController.class.getName());

    //IN
    private Image64Wrapper image;
    private List<Point64Wrapper> points;
    private int presetID;
    private int fileID;
    private int tagID;

    //Model
    private final ImageFilters filtri;
    private Preset tbp;
    private Filtro tbf;
    private Dataset tbd;
    private Rete tbr;

    //Middle
    private DataSet filteredDataset;
    private NeuralNetworkManager mng;
    private WrapperPreset preset;
    private boolean makeNeuralNetwork;
    private ArrayList<WrapperFiltro> filtriPreset;
    private int inputLayer;
    private int outputLayer;
    private int[] hiddenLayers;
    private WrapperRete rete;
    private WrapperDataset dataset;
    private double error;

    //"Views"
    private final ServerResponse response;

    public AddDatasetController() {
        response = new ServerResponse();
        filtri = new ImageFilters();
        filtri.init();
    }

    public void setImage(Image64Wrapper image) {
        this.image = image;
    }

    public void setPoints(List<Point64Wrapper> points) {
        this.points = points;
    }

    public void setPoints(Point64Wrapper[] points) {
        this.points = Arrays.asList(points);
    }

    public void initTables(DBConnection con) {
        this.tbp = new Preset(con);
        this.tbf = new Filtro(con);
        this.tbd = new Dataset(con);
        this.tbr = new Rete(con);
    }

    public void setPresetID(int presetID) {
        this.presetID = presetID;
    }

    public void setFileID(int fileID) {
        this.fileID = fileID;
    }

    public void setTagID(int tagID) {
        this.tagID = tagID;
    }

    public void execute() {
        //Cerco la rete neurale nel database. Se non la trovo la creerò successivamente.
        boolean okNetwork = getNeuralNetwork();

        if (okNetwork) {
            //Cerco il preset selezionato anche di default. (Di rete se rete nel db esiste)
            boolean okPreset = getPreset();

            if (okPreset) {

                //Ricavo i filtri utilizzati dal preset.
                boolean okFiltri = getFiltriPreset();

                if (okFiltri) {
                    //Applico i filtri all' immagine.
                    applicaFiltri();

                    //Ricavo il dataset dall' immagine.
                    getDataset();

                    //Ricavo i layers in - hidden (se ci sono) - out
                    getLayers();

                    initNeuralNetworkManager();

                    //Creo la rete neurale se necessario
                    if (makeNeuralNetwork) {
                        //Creazione rete neurale nel database
                        boolean okCreateDB = createDBNeuralNetwork();

                        if (okCreateDB) {
                            //Creazione rete neurale fisica
                            createPhysicNeuralNetwork();
                            mng.setManagedDataset(filteredDataset);
                        } else {
                            //Errore!!! response già creata
                            return;
                        }
                    } else {
                        if (getDBDataset()) {
                            //carico rete neurale
                            if (loadPhysicNeuralNetwork()) {
                                if (loadPhysicDataset()) {
                                    mng.updateManagedDataset(filteredDataset);
                                }
                            }
                        }
                    }

                    //Inserisco dataset
                    boolean okDataset = createDBDataset();

                    if (okDataset) {
                        //Salvo tutto!
                        saveMng();
                        //Addestro la rete!!! (ASYNC)
                        learnNeuralNetwork();
                        //Invio risposta affermativa!
                        response.setCode(0);
                    }
                }
            }
        }
    }

    private boolean getDBDataset() {
        tbd.clearIn();
        tbd.clearOut();

        int result = tbd.ricavaDatasetTag(tagID);

        if (result != 0) {
            response.setCode(7);
            response.setMessage("Impossibile ricavare dataset in DB (" + result + ")");
            return false;
        }

        //Recupero dataset
        this.dataset = tbd.getOut().get(0);
        return true;
    }

    private void initNeuralNetworkManager() {
        mng = new NeuralNetworkManager();
        mng.initIO();
    }

    private boolean loadPhysicDataset() {
        try {
            mng.loadDataset(dataset.getID(), dataset.getInputLayers(), dataset.getOutputLayers());
        } catch (IOException ex) {
            response.setCode(8);
            response.setMessage(ex.getLocalizedMessage());
            return false;
        }
        return true;
    }

    private void saveMng() {
        mng.initIO();
        mng.saveNetwork(rete.getID());
        mng.saveDataset(dataset.getID());
    }

    private boolean getNeuralNetwork() {
        //Prima di applicare eventuali filtri, verifico che il preset sia corretto con la rete
        //Ricavo ipotetica rete neurale.
        tbr.clearOut();
        int resultRete = tbr.ricavaReteDaTag(tagID);

        makeNeuralNetwork = false;

        if (resultRete == 0) { //Query riuscita verifico l' output.
            ArrayList<WrapperRete> out = tbr.getOut();
            if (out.isEmpty()) {
                //Nessuna rete precedentemente inserita, creo la rete neurale.
                makeNeuralNetwork = true;
            } else {
                //Rete già inserita, ricavo il preset corretto.
                rete = out.get(0);
                this.presetID = rete.getPresetID();
            }
        } else {
            response.setCode(1);
            response.setMessage("Impossibile ricavare reti neurali DB (" + resultRete + ")");
            return false;
        }
        return true;
    }

    private boolean getPreset() {
        if (presetID > 0) {
            //Ricavo il preset.
            tbp.clearOut();
            int resultPreset = tbp.ricavaPreset(presetID);

            if (resultPreset == 0) {
                preset = tbp.getOut().get(0);
            } else {
                response.setCode(3);
                response.setMessage("Impossibile ricavare preset DB (" + resultPreset + ")");
                return false;
            }
        } else {
            response.setCode(2);
            response.setMessage("preset inserito non valido");
            return false;
        }
        return true;
    }

    private boolean getFiltriPreset() {
        //Ricavo i filtri del preset
        int resultFiltri = tbf.ricavaFiltriPreset(presetID);

        if (resultFiltri == 0) {
            filtriPreset = tbf.getOut();
        } else {
            response.setCode(4);
            response.setMessage("Impossibile ricavare filtri DB (" + resultFiltri + ")");
            return false;
        }
        return true;
    }

    private void applicaFiltri() {
        //Applico filtri all' immagine.
        for (WrapperFiltro filtro : filtriPreset) {
            try {
                image.setImage(filtri.processImage(filtro.getNome(), image.getImage()));
            } catch (Exception ex) {
                LOG.log(Level.WARNING, "Filtro non trovato {0}", filtro.getNome());
            }
        }
    }

    private void getDataset() {
        ImageDatasetParser imgParser = new ImageDatasetParser(image, points, preset);
        imgParser.parse(true);

        //Abbiamo il nostro nuovo dataset già filtrato.
        filteredDataset = imgParser.getDataset();
    }

    private void getLayers() {
        PresetHiddenLayerConverter hiddenConverter = new PresetHiddenLayerConverter();
        hiddenConverter.setEncodedString(preset.getHiddenLayers());
        hiddenConverter.convertEncodedString();

        inputLayer = filteredDataset.getInputSize();
        outputLayer = filteredDataset.getOutputSize();
        hiddenLayers = hiddenConverter.getHiddenLayers();
    }

    private boolean createDBNeuralNetwork() {
        NeuralModelConverter modelConverter = new NeuralModelConverter();
        modelConverter.setInputLayer(inputLayer);
        modelConverter.setHiddenLayers(hiddenLayers);
        modelConverter.setOutputLayer(outputLayer);
        modelConverter.layersToMultipoint();

        //Conversione modello come testo
        WrapperRete reteIn = new WrapperRete();
        reteIn.setPresetID(presetID);
        reteIn.setTagID(tagID);
        reteIn.setModello(modelConverter.getMultipointString());

        tbr.clearIn();
        tbr.clearOut();
        tbr.addIn(reteIn);
        int resultRete = tbr.inserisciReti();

        if (resultRete != 0) {
            response.setCode(5);
            response.setMessage("Impossibile inserire rete in DB (" + resultRete + ")");
            return false;
        }

        //Recupero neuralID
        this.rete = tbr.getOut().get(0);

        return true;
    }

    private boolean loadPhysicNeuralNetwork() {
        try {
            mng.loadNetwork(rete.getID());
        } catch (IOException ex) {
            response.setCode(9);
            response.setMessage(ex.getLocalizedMessage());
            return false;
        }
        return true;
    }

    private void createPhysicNeuralNetwork() {
        PresetPluginsConverter pluginsConverter = new PresetPluginsConverter();
        pluginsConverter.setEncodedString(preset.getPlugins());
        pluginsConverter.convertEncodedString();

        mng = new NeuralNetworkManager();
        mng.setInLayers(inputLayer);
        mng.setHiddenLayers(hiddenLayers);
        mng.setOutLayers(outputLayer);
        mng.setLearningRule(preset.getLearningRule());
        mng.setTransferFunctionType(preset.getTransferFunction());
        mng.setLearningRate(preset.getLearningRate());
        mng.setMaxError(preset.getMaxError());
        mng.setMaxErrorFunction(preset.getMaxErrorFunction());
        mng.setColorMode(preset.getColorMode());
        mng.setWidth(preset.getWidth());
        mng.setHeight(preset.getHeight());
        mng.addPlugins(pluginsConverter.getPlugins());

        mng.create(preset.getTipoReteNeurale());
    }

    private void learnNeuralNetwork() {
        mng.asyncLearn((tmpError) -> {
            error = tmpError;
            updateDBDataset();
            saveMng();
        });
    }

    private boolean updateDBDataset() {
        this.dataset.setMaxError(error);

        tbd.clearIn();
        tbd.clearOut();

        tbd.addIn(dataset);

        int updateMaxErrorDatasets = tbd.updateMaxErrorDatasets();

        return updateMaxErrorDatasets == 0;
    }

    private boolean createDBDataset() {
        WrapperDataset datasetIn = new WrapperDataset();
        datasetIn.setNeuralID(this.rete.getID());
        datasetIn.setFileID(fileID);
        datasetIn.setInputLayers(inputLayer);
        datasetIn.setOutputLayers(outputLayer);
        datasetIn.setMaxError(error);

        tbd.clearIn();
        tbd.clearOut();
        tbd.addIn(datasetIn);

        int resultDataset = tbd.aggiungiDatasets();

        if (resultDataset != 0) {
            response.setCode(6);
            response.setMessage("Impossibile inserire dataset in DB (" + resultDataset + ")");
            return false;
        }

        //Recupero dataset
        this.dataset = tbd.getOut().get(0);
        return true;
    }

    public ServerResponse getResponse() {
        return response;
    }

}
