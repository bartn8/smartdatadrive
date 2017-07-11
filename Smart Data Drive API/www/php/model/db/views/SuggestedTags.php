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
 * Description of SuggestedTags
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class SuggestedTags extends Table {

    function __construct() {
        parent::__construct();
    }

    public function executeGetSuggestedTagsQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT seq, riscontro, tagID, tagName, tagDesc, isTagShareable "
                    . "FROM suggestedtags "
                    . "WHERE fileID = ? AND userID = ?");

            $in_userID = $this->getUserID();
            $in_fileID = $this->request["fileID"];

            $stmt->bind_param("ii", $in_fileID, $in_userID);
            $stmt->execute();

            $out_seq = 0;
            $out_tagID = 0;
            $out_tagName = "";
            $out_tagDescrizione = "";
            $out_tagCondivisibile = false;
            $out_riscontro = 0.0;

            $stmt->bind_result($out_seq, $out_riscontro, $out_tagID, $out_tagName, $out_tagDescrizione, $out_tagCondivisibile);

            $rows = 0;
            $this->response["suggestedTags"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["suggestedTags"][$i] = array();
                $this->response["suggestedTags"][$i]["seq"] = $out_seq;
                $this->response["suggestedTags"][$i]["tagID"] = $out_tagID;
                $this->response["suggestedTags"][$i]["name"] = $out_tagName;
                $this->response["suggestedTags"][$i]["desc"] = $out_tagDescrizione;
                $this->response["suggestedTags"][$i]["isShareable"] = $out_tagCondivisibile;
                $this->response["suggestedTags"][$i]["riscontro"] = $out_riscontro;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun tag suggerito trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeGetSuggestedTagQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT fileID, riscontro, tagID, tagName, tagDesc, isTagShareable "
                    . "FROM suggestedtags "
                    . "WHERE seq = ? AND userID = ?");

            $in_userID = $this->getUserID();
            $in_seq = $this->request["seq"];

            $stmt->bind_param("ii", $in_seq, $in_userID);
            $stmt->execute();

            $out_fileID = 0;
            $out_tagID = 0;
            $out_tagName = "";
            $out_tagDescrizione = "";
            $out_tagCondivisibile = false;
            $out_riscontro = 0.0;

            $stmt->bind_result($out_fileID, $out_riscontro, $out_tagID, $out_tagName, $out_tagDescrizione, $out_tagCondivisibile);

            if ($stmt->fetch()) {
                $this->response["suggestedTag"] = array();
                $this->response["suggestedTag"]["fileID"] = $out_fileID;
                $this->response["suggestedTag"]["tagID"] = $out_tagID;
                $this->response["suggestedTag"]["name"] = $out_tagName;
                $this->response["suggestedTag"]["desc"] = $out_tagDescrizione;
                $this->response["suggestedTag"]["isShareable"] = $out_tagCondivisibile;
                $this->response["suggestedTag"]["riscontro"] = $out_riscontro;
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun tag suggerito trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
