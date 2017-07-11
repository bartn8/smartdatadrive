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
import com.model.db.table.tables.Feedback;
import com.model.db.table.tables.Filtro;
import com.model.db.table.tables.Preset;
import com.model.db.table.tables.Rete;
import com.model.db.table.tables.wrapper.WrapperDataset;
import com.model.db.table.tables.wrapper.WrapperFeedback;
import com.model.db.table.tables.wrapper.WrapperFiltro;
import com.model.db.table.tables.wrapper.WrapperPreset;
import com.model.db.table.tables.wrapper.WrapperRete;
import com.model.neural.NeuralNetworkManager;
import com.model.neural.image.ImageDatasetParser;
import com.model.neural.image.map.ImageFilters;
import com.model.protocol.Parser;
import com.model.protocol.request.wrapper.Image64Wrapper;
import com.model.protocol.response.ServerResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.neuroph.core.data.DataSet;

/**
 *
 * @author luca
 */
public class FeedbackController {

    private static final Logger LOG = Logger.getLogger(FeedbackController.class.getName());

    //IN
    private boolean positive;
    private String file64;
    private String mime;
    private int userID;
    private int seq;

    //Model
    private Feedback tbfeed;
    private final Parser parser;
//    private ImageAnalyzer imageAnalyzer;
    private final ImageFilters filtri;
    private Preset tbp;
    private Filtro tbf;
    private Dataset tbd;
    private Rete tbr;

    //Middle
    private int fileID;
    private int neuralID;
    private int presetID;
    private WrapperRete rete;
    private DataSet filteredDataset;
    private NeuralNetworkManager mng;
    private WrapperPreset preset;
    private ArrayList<WrapperFiltro> filtriPreset;
    private WrapperDataset dataset;
    private double error;
    private Image64Wrapper image64;

    //"Views"
    private final ServerResponse response;

    public FeedbackController() {
        response = new ServerResponse();
        parser = new Parser();
        filtri = new ImageFilters();
        filtri.init();
    }

    public void setFile64(String file64) {
        this.file64 = file64;
    }

    public void setMime(String mime) {
        this.mime = mime;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public void setPositive(boolean positive) {
        this.positive = positive;
    }

    public void initTables(DBConnection con) {
        this.tbp = new Preset(con);
        this.tbf = new Filtro(con);
        this.tbd = new Dataset(con);
        this.tbr = new Rete(con);
        this.tbfeed = new Feedback(con);
    }

    public void execute() {
        String[] split = mime.split("/");
        switch (split[0]) {
            case "image": {
                execute_image();
            }
        }
    }

    private void execute_image() {
        //Ricavo le informazioni aggiuntive.
        if (getFeedbackInfo()) {
            //Cerco di fare il parsing del file inviato.
            if (parseImage64()) {
                //Cerco la rete neurale nel database.
                if (getNeuralNetwork()) {
                    //Cerco il preset.
                    if (getPreset()) {
                        //Ricavo i filtri
                        if (getFiltriPreset()) {
                            applicaFiltri();

                            //Applico i filtri all' immagine.
                            applicaFiltri();

                            //Ricavo il dataset dall' immagine.
                            getDataset();

                            if (getDBDataset()) {
                                //Inizializzo neural network manager
                                initNeuralNetworkManager();

                                //carico rete neurale
                                if (loadPhysicNeuralNetwork()) {

                                    //carico dataset
                                    if (loadPhysicDataset()) {

                                        mng.updateManagedDataset(filteredDataset);

                                        //Salvo tutto!
                                        saveMng();
                                        //Addestro la rete!!! (ASYNC)
                                        learnNeuralNetwork();
                                        //Invio risposta affermativa!
                                        response.setCode(0);
                                    }
                                }
                            }
//
//                            //Inserisco dataset
//                            if (createDBDataset()) {
//                                
//                            }
                        }
                    }
                }
            }
        }
    }

    private boolean getNeuralNetwork() {
        //Prima di applicare eventuali filtri, verifico che il preset sia corretto con la rete
        //Ricavo ipotetica rete neurale.
        tbr.clearOut();
        int resultRete = tbr.ricavaRete(neuralID);

        if (resultRete == 0) { //Query riuscita verifico l' output.
            ArrayList<WrapperRete> out = tbr.getOut();
            if (out.isEmpty()) {
                return false;
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
        if (presetID != 0) {
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
                image64.setImage(filtri.processImage(filtro.getNome(), image64.getImage()));
            } catch (Exception ex) {
                LOG.log(Level.WARNING, "Filtro non trovato {0}", filtro.getNome());
            }
        }
    }

    private void getDataset() {
        ImageDatasetParser imgParser = new ImageDatasetParser(image64, new ArrayList<>(), preset);
        imgParser.parse(positive);

        //Abbiamo il nostro nuovo dataset già filtrato.
        filteredDataset = imgParser.getDataset();
    }

    private void initNeuralNetworkManager() {
        mng = new NeuralNetworkManager();
        mng.initIO();
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

    private void learnNeuralNetwork() {
        mng.asyncLearn((tmpError) -> {
            error = tmpError;
            updateDBDataset();
            saveMng();
        });
    }

//    private boolean createDBDataset() {
//        WrapperDataset datasetIn = new WrapperDataset();
//        datasetIn.setNeuralID(this.rete.getID());
//        datasetIn.setFileID(fileID);
//        datasetIn.setInputLayers(filteredDataset.getInputSize());
//        datasetIn.setOutputLayers(filteredDataset.getOutputSize());
//        datasetIn.setMaxError(error);
//
//        tbd.clearIn();
//        tbd.clearOut();
//        tbd.addIn(datasetIn);
//
//        int resultDataset = tbd.aggiungiDatasets();
//
//        if (resultDataset != 0) {
//            response.setCode(6);
//            response.setMessage("Impossibile inserire dataset in DB (" + resultDataset + ")");
//            return false;
//        }
//
//        //Recupero dataset
//        this.dataset = tbd.getOut().get(0);
//        return true;
//    }
    private boolean getDBDataset() {
        tbd.clearIn();
        tbd.clearOut();

        int result = tbd.ricavaDatasetRete(userID, neuralID);

        if (result != 0) {
            response.setCode(7);
            response.setMessage("Impossibile ricavare dataset in DB (" + result + ")");
            return false;
        }

        //Recupero dataset
        this.dataset = tbd.getOut().get(0);
        return true;
    }

    private boolean updateDBDataset() {
        this.dataset.setMaxError(error);

        tbd.clearIn();
        tbd.clearOut();

        tbd.addIn(dataset);

        int updateMaxErrorDatasets = tbd.updateMaxErrorDatasets();

        return updateMaxErrorDatasets == 0;
    }

    private boolean parseImage64() {
        try {
            image64 = parser.parseImage64(mime, file64);
        } catch (IOException ex) {
            response.setCode(1);
            response.setMessage("Immagine malformata");
            return false;
        }
        return true;
    }

    private boolean getFeedbackInfo() {
        if (userID > 0 && seq > 0) {
            tbfeed.clearOut();
            int resultFeedback = tbfeed.restituisciFeedback(seq, userID);
            if (resultFeedback == 0) {
                WrapperFeedback feedback = tbfeed.getOut().get(0);

                fileID = feedback.getFileID();
                neuralID = feedback.getNeuralID();

            } else {
                response.setCode(3);
                response.setMessage("Impossibile ricavare feedback DB (" + resultFeedback + ")");
                return false;
            }
        } else {
            response.setCode(2);
            response.setMessage("preset inserito non valido");
            return false;
        }
        return true;
    }

    public ServerResponse getResponse() {
        return response;
    }

}
