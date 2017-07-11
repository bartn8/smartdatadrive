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
 * Description of FileTagLink
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class FileTagLink extends Table {

    public function __construct() {
        parent::__construct();
    }

    public function executeAddFileTagLinkQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("INSERT INTO file_tag_link (id_tag, id_file) "
                    . "SELECT t.id, f.id "
                    . "FROM file AS f "
                    . "INNER JOIN directory AS dir ON dir.id = f.id_directory "
                    . "INNER JOIN drive AS d ON d.id = dir.id_drive "
                    . "INNER JOIN tag AS t ON (t.condivisibile = 1 OR t.id_creatore = d.id_utente) "
                    . "WHERE d.id_utente = ? AND f.id = ? AND t.id = ?");

            $in_tagID = $this->request["tagID"];
            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_userID, $in_fileID, $in_tagID);
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
                    $this->errorMessage = "Nessun link tag file inserito";
                    break;
                case 1:
                    $this->code = 0;
                    $out_fileTagLinkID = $stmt->insert_id;
                    $this->response["fileTagLink"] = array();
                    $this->response["fileTagLink"]["fileTagLinkID"] = $out_fileTagLinkID;
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

    public function executeRemoveFileTagLinkQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("DELETE lnk.* "
                    . "FROM file_tag_link AS lnk "
                    . "INNER JOIN file ON file.id = lnk.id_file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE lnk.id_tag = ? AND lnk.id_file = ? AND drive.id_utente = ?");

            $in_tagID = $this->request["tagID"];
            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_tagID, $in_fileID, $in_userID);
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
                    $this->errorMessage = "Nessun link tag file rimosso";
                    break;
                case 1:
                    $this->code = 0;
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

    public function executeRemoveFileTagsLinkQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("DELETE lnk.* "
                    . "FROM file_tag_link AS lnk "
                    . "INNER JOIN file ON file.id = lnk.id_file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE lnk.id_file = ? AND drive.id_utente = ?");

            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("ii", $in_fileID, $in_userID);
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
                    $this->errorMessage = "Nessun link tag file rimosso";
                    break;
                case 1:
                    $this->code = 0;
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

}