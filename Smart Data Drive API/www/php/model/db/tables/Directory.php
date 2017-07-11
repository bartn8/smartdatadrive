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
 * Description of Directory
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Directory extends Table {

    public function __construct() {
        parent::__construct();
    }

    public function executeLsDirQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT dirID, dirName "
                    . "FROM lsdir "
                    . "WHERE dirIDParent = ? AND userID = ?");

            $in_dirIDParent = $this->request["dirIDParent"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("ii", $in_dirIDParent, $in_userID);
            $stmt->execute();

            $out_dirID = 0;
            $out_dirName = "";

            $stmt->bind_result($out_dirID, $out_dirName);

            $rows = 0;
            $this->response["lsDir"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["lsDir"][$i] = array();
                $this->response["lsDir"][$i]["dirID"] = $out_dirID;
                $this->response["lsDir"][$i]["dirName"] = $out_dirName;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessuna cartella trovata";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeGetUpperDirQuery() {
        if ($this->dbConn->connect()) {
            //Preparo la query.
            $stmt = $this->dbConn->prepare("SELECT dir.id, dir.nome "
                    . "FROM directory AS dir "
                    . "INNER JOIN drive ON dir.id_drive = drive.id "
                    . "WHERE dir.id = (SELECT id_parent FROM directory WHERE id = ?) AND drive.id_utente = ?");

            $in_dirID = $this->request["dirID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("ii", $in_dirID, $in_userID);
            $stmt->execute();

            $out_dirID = 0;
            $out_dirName = "";

            $stmt->bind_result($out_dirID, $out_dirName);

            $this->response["upperDir"] = array();

            if ($stmt->fetch()) {
                $this->code = 0;
                $this->response["upperDir"]["dirID"] = $out_dirID;
                $this->response["upperDir"]["dirName"] = $out_dirName;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Cartella non trovata";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeGetRootQuery() {
        if ($this->dbConn->connect()) {
            //Preparo la query.
            $stmt = $this->dbConn->prepare("SELECT dirID, dirName "
                    . "FROM rootdir "
                    . "WHERE userID = ?");

            $in_userID = $this->getUserID();

            $stmt->bind_param("i", $in_userID);
            $stmt->execute();

            $out_dirID = 0;
            $out_dirName = "";

            $stmt->bind_result($out_dirID, $out_dirName);

            $this->response["rootDir"] = array();

            if ($stmt->fetch()) {
                $this->code = 0;
                $this->response["rootDir"]["dirID"] = $out_dirID;
                $this->response["rootDir"]["dirName"] = $out_dirName;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Cartella non trovata";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeMkDirQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("INSERT INTO directory (id_drive, nome, id_parent, path) "
                    . "SELECT dir.id_drive, ?, dir.id, CONCAT(dir.path, ?) "
                    . "FROM directory AS dir "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE drive.id_utente = ? AND dir.id = ?");

            $in_dirName = $this->request["dirName"];
            $in_userID = $this->getUserID();
            $in_dirID = $this->request["dirIDParent"];

            $stmt->bind_param("ssii", $in_dirName, $in_dirName, $in_userID, $in_dirID);
            $stmt->execute();

            $this->response["mkDir"] = array();

            switch ($stmt->affected_rows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessuna cartella creata";
                    break;
                case 1:
                    $this->code = 0;
                    $this->response["mkDir"]["dirID"] = $stmt->insert_id;
                    $this->response["mkDir"]["dirName"] = $in_dirName;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Errore ($stmt->affected_row)";
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
