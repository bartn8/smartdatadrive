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
import com.model.db.table.tables.Filtro;
import com.model.db.table.tables.Preset;
import com.model.db.table.tables.PresetFiltroLink;
import com.model.db.table.tables.Rete;
import com.model.db.table.tables.Riscontro;
import com.model.db.table.tables.wrapper.WrapperFiltro;
import com.model.db.table.tables.wrapper.WrapperPreset;
import com.model.db.table.tables.wrapper.WrapperPresetFiltroLink;
import com.model.db.table.tables.wrapper.WrapperRete;
import com.model.db.table.tables.wrapper.WrapperRiscontro;
import com.model.neural.analize.ImageAnalyzer;
import com.model.protocol.Parser;
import com.model.protocol.request.wrapper.Image64Wrapper;
import com.model.protocol.response.ServerResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author luca
 */
public class AnalyzeFileController {

    private static final Logger LOG = Logger.getLogger(AnalyzeFileController.class.getName());

    //IN
    private String file64;
    private String mime;
    private int fileID;
    private int userID;

    //Model
    private Riscontro tbrisc;
    private Preset tbpreset;
    private Rete tbrete;
    private Filtro tbfiltri;
    private PresetFiltroLink tblink;
    private final Parser parser;
    private ImageAnalyzer imageAnalyzer;

    //Middle
    private Image64Wrapper image64;
    private ArrayList<WrapperRete> reti;
    private ArrayList<WrapperPreset> presets;
    private HashMap<WrapperRete, Double> mapping;
    private ArrayList<WrapperFiltro> filtri;
    private ArrayList<WrapperPresetFiltroLink> links;

    //"View"
    private final ServerResponse response;

    public AnalyzeFileController() {
        response = new ServerResponse();
        parser = new Parser();
        mapping = new HashMap<>();
    }

    public void initTables(DBConnection con) {
        this.tbrisc = new Riscontro(con);
        this.tbpreset = new Preset(con);
        this.tbrete = new Rete(con);
        this.tbfiltri = new Filtro(con);
        this.tblink = new PresetFiltroLink(con);
    }

    public void setFile64(String file64) {
        this.file64 = file64;
    }

    public void setMime(String mime) {
        this.mime = mime;
    }

    public void setFileID(int fileID) {
        this.fileID = fileID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
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
        //Cerco di fare il parsing del file inviato.
        if (parseImage64()) {
            //Ricavo le reti principali
            if (getParentNeuralNetworks()) {
                //Ricavo i presets
                if (getPresets()) {
                    //Ricavo i filtri
                    if (getFiltri()) {
                        //Ricavo i link filtro - preset
                        if (getLinks()) {
                            imageAnalyzer = new ImageAnalyzer(image64, presets, filtri, links);
                            imageAnalyzer.initNeuralNetworkManager();
                            
                            while (!reti.isEmpty()) {
                                valutation();
                                filtraRetiCattive();
                                if (!getNetworkChildren()) {
                                    return;
                                }
                            }

                            pubblicaRiscontri();
                            //Invio risposta affermativa!
                            response.setCode(0);
                        }
                    }
                }
            }
        }
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

    private boolean getParentNeuralNetworks() {
        tbrete.clearOut();
        int resultReti = tbrete.ricavaRetiGenerali(userID);

        if (resultReti == 0) {
            reti = tbrete.getOut();
        } else {
            response.setCode(2);
            response.setMessage("Impossibile ricavare reti generali DB (" + resultReti + ")");
            return false;
        }
        return true;
    }

    private boolean getPresets() {
        //Ricavo il preset.
        tbpreset.clearOut();
        int resultPreset = tbpreset.ricavaPresets();

        if (resultPreset == 0) {
            presets = tbpreset.getOut();
        } else {
            response.setCode(3);
            response.setMessage("Impossibile ricavare preset DB (" + resultPreset + ")");
            return false;
        }

        return true;
    }

    private boolean getFiltri() {
        //Ricavo i filtri del preset
        int resultFiltri = tbfiltri.ricavaFiltri();

        if (resultFiltri == 0) {
            filtri = tbfiltri.getOut();
        } else {
            response.setCode(4);
            response.setMessage("Impossibile ricavare filtri DB (" + resultFiltri + ")");
            return false;
        }
        return true;
    }

    private boolean getLinks() {
        //Ricavo i filtri del preset
        int resultLinks = tblink.ricavaLinks();

        if (resultLinks == 0) {
            links = tblink.getOut();
        } else {
            response.setCode(4);
            response.setMessage("Impossibile ricavare link DB (" + resultLinks + ")");
            return false;
        }
        return true;
    }

    private void valutation() {
        for (WrapperRete rete : reti) {
            imageAnalyzer.setNetwork(rete);
            try {
                imageAnalyzer.loadNetwork();
            } catch (IOException ex) {
                mapping.put(rete, 0.0);
                return;
            }
            imageAnalyzer.calculate();
            double riscontro = imageAnalyzer.getRiscontro();
            mapping.put(rete, riscontro);
        }
    }

    private void filtraRetiCattive() {
        Iterator<Map.Entry<WrapperRete, Double>> iterator = mapping.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<WrapperRete, Double> next = iterator.next();
            if (next.getValue() < 0.5) {
                reti.remove(next.getKey());
            }
        }
    }

    private boolean pubblicaRiscontri() {
        tbrisc.clearIn();
        tbrisc.clearOut();

        Iterator<Map.Entry<WrapperRete, Double>> iterator = mapping.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<WrapperRete, Double> next = iterator.next();

            WrapperRete rete = next.getKey();
            double riscontro = next.getValue();

            WrapperRiscontro risc = new WrapperRiscontro();
            risc.setNeuralID(rete.getID());
            risc.setFileID(fileID);
            risc.setRiscontro(riscontro);

            tbrisc.addIn(risc);
        }

        int resultRiscontri = tbrisc.inserisciRiscontri();

        if (resultRiscontri == 3) {
            tbrisc.rimuoviRiscontri();
            resultRiscontri = tbrisc.inserisciRiscontri();
        }

        if (resultRiscontri != 0) {
            response.setCode(4);
            response.setMessage("Impossibile inserire riscontri in DB (" + resultRiscontri + ")");
            return false;
        }

        return true;
    }

    private boolean getNetworkChildren() {
        tbrete.clearIn();
        tbrete.clearOut();
        for (WrapperRete rete : reti) {
            int ricavaRetiFiglie = tbrete.ricavaRetiFiglie(rete.getTagID());
            if (ricavaRetiFiglie != 0) {
                response.setCode(5);
                response.setMessage("Impossibile ricavare reti dal DB (" + ricavaRetiFiglie + ")");
                return false;
            }
        }
        reti = tbrete.getOut();
        return true;
    }

    public ServerResponse getResponse() {
        return response;
    }

}
