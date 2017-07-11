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
package com.controller;

import com.controller.command.AddDatasetController;
import com.controller.command.AnalyzeFileController;
import com.controller.command.FeedbackController;
import com.model.db.DBConnection;
import com.model.db.DBInfo;
import com.model.protocol.Parser;
import com.model.protocol.request.ClientRequest;
import com.model.protocol.request.wrapper.Image64Wrapper;
import com.model.protocol.request.wrapper.Point64Wrapper;
import com.model.protocol.response.ServerResponse;
import com.model.util.Configuration;
import java.io.IOException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Controller {

    private static final Logger LOG = Logger.getLogger(Controller.class.getName());

    private ClientRequest request;
    private ServerResponse response;

    //MODELS
    private final Parser parser;
    private Image64Wrapper image;
    private Point64Wrapper[] points;
    private HashMap<String, String> datas;
    private final DBConnection dbConn;

    public Controller(Configuration conf) {
        parser = new Parser();
        image = new Image64Wrapper();
        points = new Point64Wrapper[0];
        response = new ServerResponse();
        dbConn = new DBConnection(new DBInfo(conf.getMysqlProtocol(), conf.getMysqlServerURL(), conf.getMysqlPort(), conf.getMysqlUsername(), conf.getMysqlPassword(), conf.getMysqlDbName()));
    }

    public void elaboraRisposta() {
        if (request != null) {
            switch (this.request.getCommand()) {
                case 1: {//Analisi file
                    command_analizeFile();
                    break;
                }
                case 2: { //Aggiungere dataset immagine
                    command_addDataset();
                    break;
                }
                case 3: {//feedback
                    command_Feedback();
                    break;
                }
//                case 4: {//Negative Feedback 
//                    command_negativeFeedback();
//                    break;
//                }
                default://Echo
                    command_echo();
                    break;
            }
        }
    }

    private void command_analizeFile() {
        //carico dati
        loadData();
        AnalyzeFileController subController = new AnalyzeFileController();
        subController.setFile64(this.request.getFile64());
        subController.setMime(this.datas.getOrDefault("mime", ""));
        subController.setFileID(Integer.parseInt(this.datas.getOrDefault("fileID", "0")));
        subController.setUserID(Integer.parseInt(this.datas.getOrDefault("userID", "0")));
        subController.initTables(dbConn);
        
        subController.execute();
        this.response = subController.getResponse();
    }

    private void command_addDataset() {
        //carico dati
        loadData();
        try {
            //carico dataset
            loadDataset();
        } catch (IllegalArgumentException ex) {
            LOG.log(Level.WARNING, "Errore nel parsing", ex);
            response.setCode(-2);
            response.setMessage("Dataset formato male");
            return;
        } catch (IOException ex) {
            LOG.log(Level.WARNING, "Impossibile ricavare dataset", ex);
            response.setCode(-1);
            response.setMessage("Dataset formato male");
            return;
        }

        int presetID = Integer.parseInt(datas.getOrDefault("presetID", "0"));
        int fileID = Integer.parseInt(datas.getOrDefault("fileID", "0"));
        int tagID = Integer.parseInt(datas.getOrDefault("tagID", "0"));

        AddDatasetController subController = new AddDatasetController();
        subController.initTables(dbConn);
        subController.setPresetID(presetID);
        subController.setFileID(fileID);
        subController.setTagID(tagID);
        subController.setPoints(points);
        subController.setImage(image);

        subController.execute();
        this.response = subController.getResponse();
    }

    private void command_Feedback() {
        //carico dati
        loadData();
        
        int userID = Integer.parseInt(datas.getOrDefault("userID", "0"));
        int seq = Integer.parseInt(datas.getOrDefault("seq", "0"));
        String mime = this.datas.getOrDefault("mime", "");
        String file64 = this.request.getFile64();
        boolean positive = Boolean.parseBoolean(this.datas.getOrDefault("positive", "true"));
        
        FeedbackController subController = new FeedbackController();
        subController.initTables(dbConn);
        subController.setFile64(file64);
        subController.setMime(mime);
        subController.setSeq(seq);
        subController.setUserID(userID);
        subController.setPositive(positive);
        
        subController.execute();
        this.response = subController.getResponse();
        
    }

    private void command_echo() {
        response.setCode(0);
        response.setMessage("Echoing..");
        response.setData(request.getData());
    }

    private void loadData() {
        datas = parser.parseData(this.request.getData());
    }

    private void loadDataset() throws IOException {
        image = parser.parseImage64(this.request.getImage64());
        points = parser.parsePoints64(this.request.getPoints64());
    }

    public void setRequest(ClientRequest request) {
        this.request = request;
    }

    public ServerResponse getResponse() {
        return response;
    }

}
