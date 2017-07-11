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
 * Description of NeuralInfo
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class NeuralInfo extends Table {

    private $gis;

    public function __construct() {
        parent::__construct();
        $this->gis = new \gisconverter\WKT();
    }

    public function executeNeuralInfoQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT tagName, tagDesc, isTagShareable, tagTimestamp, nickname, tagIDParent, tagNameParent, riscontro, dataAnalisi, neuralID, neuralModel, fileMIME "
                    . "FROM neuralinfo "
                    . "WHERE tagID = ? AND fileID = ? AND userID = ?");

            $in_tagID = $this->request["tagID"];
            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_tagID, $in_fileID, $in_userID);
            $stmt->execute();

            $out_tagNome = "";
            $out_tagDescrizione = "";
            $out_tagCondivisibile = false;
            $out_tagDataCreazione = "1970-01-01 00:00:00";
            $out_tagNicknameCreatore = "Default";
            $out_tagParentID = 0;
            $out_tagParentNome = "";
            $out_riscontroTagFile = 0.0;
            $out_riscontroDataAnalisi = "1970-01-01 00:00:00";
            $out_reteNeuraleID = 0;
            $out_reteNeuraleModello = "";
            $out_fileMIME = "";

            $stmt->bind_result($out_tagNome, $out_tagDescrizione, $out_tagCondivisibile, $out_tagDataCreazione, $out_tagNicknameCreatore, $out_tagParentID, $out_tagParentNome, $out_riscontroTagFile, $out_riscontroDataAnalisi, $out_reteNeuraleID, $out_reteNeuraleModello, $out_fileMIME);

            if ($stmt->fetch()) {
                $this->code = 0;
                $this->response["neuralInfo"] = array();
                $this->response["neuralInfo"]["tagName"] = $out_tagNome;
                $this->response["neuralInfo"]["tagDescription"] = $out_tagDescrizione;
                $this->response["neuralInfo"]["tagCreationDate"] = $out_tagDataCreazione;
                $this->response["neuralInfo"]["tagAuthorNickname"] = $out_tagNicknameCreatore;
                $this->response["neuralInfo"]["isTagShareable"] = $out_tagCondivisibile;
                $this->response["neuralInfo"]["tagParentID"] = $out_tagParentID;
                $this->response["neuralInfo"]["tagParentName"] = $out_tagParentNome;
                $this->response["neuralInfo"]["matchTagFile"] = $out_riscontroTagFile;
                $this->response["neuralInfo"]["matchTagFileDate"] = $out_riscontroDataAnalisi;
                $this->response["neuralInfo"]["neuralNetworkID"] = $out_reteNeuraleID;
//                try {
//                    $this->response["neuralInfo"]["neuralNetworkModel"] = json_decode($this->gis->geomFromText($out_reteNeuraleModello)->toGeoJSON());
//                }/*catch(\gisconverter\CustomException $ex){
//                    $this->response["neuralInfo"]["neuralNetworkModel"] = null;
//                }*/ catch (Exception $e) {
//                    $this->response["neuralInfo"]["neuralNetworkModel"] = null;
//                }
                $this->response["neuralInfo"]["neuralNetworkModel"] = null;
                $this->response["neuralInfo"]["fileMIME"] = $out_fileMIME;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessuna informazione neurale trovata";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
