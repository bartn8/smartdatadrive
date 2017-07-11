<?php

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

namespace model\db\table;

/**
 * Description of NeuralDatasets
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class NeuralDatasets extends Table {

    function __construct() {
        parent::__construct();
    }

    public function executeGetNeuralDatasetsQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT datasetID, maxError, meanMaxError "
                    . "FROM neuraldatasets "
                    . "WHERE fileID = ? AND tagID = ? AND userID = ?");

            $in_fileID = $this->request["fileID"];
            $in_tagID = $this->request["tagID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_fileID, $in_tagID, $in_userID);
            $stmt->execute();

            $out_datasetID = 0;
            $out_maxError = 0.0;
            $out_networkMaxError = 0.0;

            $stmt->bind_result($out_datasetID, $out_maxError, $out_networkMaxError);

            $rows = 0;
            $this->response["datasets"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["datasets"][$i] = array();
                $this->response["datasets"][$i]["datasetID"] = $out_datasetID;
                $this->response["datasets"][$i]["maxError"] = $out_maxError;
                $this->response["datasets"][$i]["networkMaxError"] = $out_networkMaxError;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun dataset trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
