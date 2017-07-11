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
 * Description of FileInfo
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class FileInfo extends Table {

    function __construct() {
        parent::__construct();
    }

    public function executeFileInfoQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT path, fileName, fileType, fileInfo, fileMIME, fileHash, hashFunction "
                    . "FROM fileinfo "
                    . "WHERE userID = ? AND fileID = ?");

            $in_userID = $this->getUserID();
            $in_fileID = $this->request["fileID"];

            $stmt->bind_param("ii", $in_userID, $in_fileID);
            $stmt->execute();

            $filePath = "";
            $fileNome = "";
            $fileTipo = "";
            $fileInfo = "";
            $fileMIME = "";
            $fileHash = "";
            $hashFunction = "";

            $stmt->bind_result($filePath, $fileNome, $fileTipo, $fileInfo, $fileMIME, $fileHash, $hashFunction);

            $this->response["fileInfo"] = array();
            
            if ($stmt->fetch()) {
                $this->code = 0;
                $this->response["fileInfo"]["path"] = $filePath;
                $this->response["fileInfo"]["type"] = $fileTipo;
                $this->response["fileInfo"]["info"] = $fileInfo;
                $this->response["fileInfo"]["name"] = $fileNome;
                $this->response["fileInfo"]["fileID"] = $this->request["fileID"];
                $this->response["fileInfo"]["mime"] = $fileMIME;
                $this->response["fileInfo"]["fileHash"] = $fileHash;
                $this->response["fileInfo"]["hashFunction"] = $hashFunction;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "File non trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeIsFileIDValid() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT COUNT(*) AS count "
                    . "FROM fileinfo "
                    . "WHERE userID = ? AND fileID = ?");

            $in_userID = $this->getUserID();
            $in_fileID = $this->request["fileID"];

            $stmt->bind_param("ii", $in_userID, $in_fileID);
            $stmt->execute();

            $out_count = 0;

            $stmt->bind_result($out_count);

            if ($stmt->fetch()) {
                $ok = $out_count == 1;
                $this->code = 0;
                $this->response["isFileIDValid"] = $ok;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "File non trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
