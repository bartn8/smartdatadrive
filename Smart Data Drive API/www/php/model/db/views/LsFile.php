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
 * Description of LsFile
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class LsFile extends Table {

    public function __construct() {
        parent::__construct();
    }

    public function executeLsFileQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT fileID, path, fileName, fileType, fileInfo "
                    . "FROM lsfile "
                    . "WHERE userID = ? AND dirID = ?");

            $in_userID = $this->getUserID();
            $in_dirID = $this->request["dirID"];

            $stmt->bind_param("ii", $in_userID, $in_dirID);
            $stmt->execute();

            $out_fileID = "";
            $out_filePath = "";
            $out_fileNome = "";
            $out_fileTipo = "";
            $out_fileInfo = "";

            $stmt->bind_result($out_fileID, $out_filePath, $out_fileNome, $out_fileTipo, $out_fileInfo);

            $rows = 0;
            $this->response["lsFile"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["lsFile"][$i] = array();
                $this->response["lsFile"][$i]["fileID"] = $out_fileID;
                $this->response["lsFile"][$i]["path"] = $out_filePath;
                $this->response["lsFile"][$i]["name"] = $out_fileNome;
                $this->response["lsFile"][$i]["type"] = $out_fileTipo;
                $this->response["lsFile"][$i]["info"] = $out_fileInfo;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun file trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeFilteredLsFileQuery() {
        if ($this->dbConn->connect()) {
            //Preparo la query.
            $in_userID = $this->getUserID();
            $in_dirID = $this->request["dirID"];
            $in_tagsID = $this->request["tagsID"];

            $params = "ii";
            $sql = "AND lnk.id_tag IN(";
            $rmv = false;

            foreach ($in_tagsID as $in_tagID) {
                $sql .= "?,";
                $params .= "i";
                $rmv = true;
            }

            if ($rmv) {
                $sql = \substr($sql, 0, -1);//Rimuovo ',' alla fine
                $sql .= ")";
            }else{
                $sql = "";
            }
                   
            
            $stmt = $this->dbConn->prepare("SELECT fileID, path, fileName, fileType, fileInfo "
                    . "FROM lsfile "
                    . "INNER JOIN file_tag_link AS lnk ON lnk.id_file = fileID "
                    . "WHERE userID = ? AND dirID = ? $sql");

            
            $func = array($stmt, "bind_param");
            $func(... \array_merge([$params, $in_userID, $in_dirID], $in_tagsID));
                        
            $stmt->execute();

            $out_fileID = "";
            $out_filePath = "";
            $out_fileNome = "";
            $out_fileTipo = "";
            $out_fileInfo = "";

            $stmt->bind_result($out_fileID, $out_filePath, $out_fileNome, $out_fileTipo, $out_fileInfo);

            $rows = 0;
            $this->response["lsFile"] = array();

            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["lsFile"][$i] = array();
                $this->response["lsFile"][$i]["fileID"] = $out_fileID;
                $this->response["lsFile"][$i]["path"] = $out_filePath;
                $this->response["lsFile"][$i]["name"] = $out_fileNome;
                $this->response["lsFile"][$i]["type"] = $out_fileTipo;
                $this->response["lsFile"][$i]["info"] = $out_fileInfo;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun file trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
