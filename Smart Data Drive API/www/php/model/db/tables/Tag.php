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
 * Description of Tag
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Tag extends Table {

    public function __construct() {
        parent::__construct();
    }

    public function executeTagCreationQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("INSERT INTO tag (nome, descrizione, id_parent, condivisibile, id_creatore) "
                    . "VALUES (?,?,?,?,?)");

            $in_nomeTag = $this->request["tagName"];
            $in_descrizioneTag = $this->request["tagDesc"];
            $in_parentID = $this->request["tagIDParent"] > 0 ? $this->request["tagIDParent"] : null;
            $in_tagCondivisibile = $this->request["isTagShareable"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("ssiii", $in_nomeTag, $in_descrizioneTag, $in_parentID, $in_tagCondivisibile, $in_userID);
            $result = $stmt->execute();

            if (!$result) {
                $this->code = 4;
                $this->errorMessage = "Errore SQL: " . $stmt->error;
                $stmt->close();
                $this->dbConn->close();
                return;
            }

            switch ($stmt->affected_rows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun tag inserito";
                    break;
                case 1:
                    $this->code = 0;
                    $out_tagID = $stmt->insert_id;
                    $this->response["tag"] = array();
                    $this->response["tag"]["tagID"] = $out_tagID;
                    $this->response["tag"]["name"] = $in_nomeTag;
                    $this->response["tag"]["desc"] = $in_descrizioneTag;
                    $this->response["tag"]["parentID"] = $in_parentID;
                    $this->response["tag"]["isShareable"] = $in_tagCondivisibile;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Errore nelle righe: ($stmt->affected_rows)";
                    break;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeGetFileTagsQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT tagID, tagName, tagDesc, isTagShareable "
                    . "FROM filetags "
                    . "WHERE fileID = ? AND userID = ?");

            $in_userID = $this->getUserID();
            $in_fileID = $this->request["fileID"];

            $stmt->bind_param("ii", $in_fileID, $in_userID);
            $stmt->execute();

            $out_tagID = 0;
            $out_tagName = "";
            $out_tagDescrizione = "";
            $out_tagCondivisibile = false;

            $stmt->bind_result($out_tagID, $out_tagName, $out_tagDescrizione, $out_tagCondivisibile);

            $rows = 0;
            $this->response["tags"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["tags"][$i] = array();
                $this->response["tags"][$i]["tagID"] = $out_tagID;
                $this->response["tags"][$i]["name"] = $out_tagName;
                $this->response["tags"][$i]["desc"] = $out_tagDescrizione;
                $this->response["tags"][$i]["isShareable"] = $out_tagCondivisibile;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun tag trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeGetDirTagsQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT DISTINCT tagID, tagName, tagDesc, isTagShareable "
                    . "FROM dirtags "
                    . "WHERE dirID = ? AND userID = ?");

            $in_userID = $this->getUserID();
            $in_dirID = $this->request["dirID"];

            $stmt->bind_param("ii", $in_dirID, $in_userID);
            $stmt->execute();

            $out_tagID = 0;
            $out_tagName = "";
            $out_tagDescrizione = "";
            $out_tagCondivisibile = false;

            $stmt->bind_result($out_tagID, $out_tagName, $out_tagDescrizione, $out_tagCondivisibile);

            $rows = 0;
            $this->response["tags"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["tags"][$i] = array();
                $this->response["tags"][$i]["tagID"] = $out_tagID;
                $this->response["tags"][$i]["name"] = $out_tagName;
                $this->response["tags"][$i]["desc"] = $out_tagDescrizione;
                $this->response["tags"][$i]["isShareable"] = $out_tagCondivisibile;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun tag trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeGetTagsQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT tag.id, tag.nome, tag.descrizione, tag.condivisibile "
                    . "FROM tag "
                    . "WHERE tag.id_creatore = ? OR tag.condivisibile = 1");

            $in_userID = $this->getUserID();

            $stmt->bind_param("i", $in_userID);
            $stmt->execute();

            $out_tagID = 0;
            $out_tagName = "";
            $out_tagDescrizione = "";
            $out_tagCondivisibile = false;

            $stmt->bind_result($out_tagID, $out_tagName, $out_tagDescrizione, $out_tagCondivisibile);

            $rows = 0;
            $this->response["tags"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["tags"][$i] = array();
                $this->response["tags"][$i]["tagID"] = $out_tagID;
                $this->response["tags"][$i]["name"] = $out_tagName;
                $this->response["tags"][$i]["desc"] = $out_tagDescrizione;
                $this->response["tags"][$i]["isShareable"] = $out_tagCondivisibile;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun tag trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
