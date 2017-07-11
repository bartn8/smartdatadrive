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
 * Description of File
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class File extends Table {

    function __construct() {
        parent::__construct();
    }

    public function executeInsertFileQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("INSERT INTO file (id_directory, nome, tipo, mime, hash, function) "
                    . "SELECT dir.id, ?, ?, ?, ?, ? "
                    . "FROM directory AS dir "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE dir.id = ? AND drive.id_utente = ?");

            $in_nomeFile = $this->request["fileName"];
            $in_tipoFile = $this->request["fileType"];
            $in_mimeFile = $this->request["fileMIME"];
            $in_hashFile = $this->request["fileHash"];
            $in_hashFunction = $GLOBALS["defaultHashAlgorithm"];
            $in_dirID = $this->request["dirID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("sssssii", $in_nomeFile, $in_tipoFile, $in_mimeFile, $in_hashFile, $in_hashFunction, $in_dirID, $in_userID);
            $stmt->execute();

            $out_insert_id = $stmt->insert_id;

            if ($out_insert_id > 0) {
                $this->response["fileID"] = $out_insert_id;
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Impossibile aggiungere file";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeRenameFileQuery() {
        if ($this->dbConn->connect()) {
            //Preparo ed eseguo la query.
            $stmt = $this->dbConn->prepare("UPDATE file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "SET file.nome = ? "
                    . "WHERE file.id = ? AND drive.id_utente = ?");

            $in_newName = $this->request["newName"];
            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("sii", $in_newName, $in_fileID, $in_userID);
            $stmt->execute();

            //elaboro risposta.
            switch ($stmt->affected_rows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun file modificato";
                    break;
                case 1:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Troppi file modificati ($stmt->affected_rows)";
                    break;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeDeleteFileQuery() {
        if ($this->dbConn->connect()) {
            //Preparo ed eseguo la query.
            $stmt = $this->dbConn->prepare("DELETE file.* "
                    . "FROM file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE file.id = ? AND drive.id_utente = ?");

            $in_userID = $this->getUserID();
            $in_fileID = $this->request["fileID"];

            $stmt->bind_param("ii", $in_fileID, $in_userID);
            $stmt->execute();

            //elaboro risposta.
            switch ($stmt->affected_rows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun file eliminato";
                    break;
                case 1:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Riscontro non previsto ($stmt->affected_rows)";
                    break;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeChangeFileInfoQuery() {
        if ($this->dbConn->connect()) {
            //Preparo ed eseguo la query.
            $stmt = $this->dbConn->prepare("UPDATE file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "SET file.info = ? "
                    . "WHERE file.id = ? AND drive.id_utente = ?");

            $in_fileInfo = $this->request["fileInfo"];
            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("sii", $in_fileInfo, $in_fileID, $in_userID);
            $stmt->execute();

            //elaboro risposta.
            switch ($stmt->affected_rows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun file modificato";
                    break;
                case 1:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Troppi file modificati ($stmt->affected_rows)";
                    break;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeCutFilesQuery() {
        if ($this->dbConn->connect()) {
            //Preparo ed eseguo la query.
            $stmt = $this->dbConn->prepare("UPDATE file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "SET file.id_directory = ? "
                    . "WHERE file.id = ? AND drive.id_utente = ?");

            $in_destDirID = $this->request["destDirID"];
            $in_fileID = 0;
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_destDirID, $in_fileID, $in_userID);

            $countFiles = count($this->request["filesID"]);
            $finalRows = 0;

            for ($i = 0; $i < $countFiles; $i++) {
                $in_fileID = (int) $this->request["filesID"][$i];
                $stmt->execute();

                if ($stmt->affected_rows != -1) {
                    $finalRows += $stmt->affected_rows;
                } else {
                    $this->code = 4;
                    $this->errorMessage = "Errore nella query: " . $stmt->error;

                    $stmt->close();
                    $this->dbConn->close();
                    return;
                }
            }

            //elaboro risposta.
            switch ($finalRows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun file spostato";
                    break;
                case $countFiles:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Non tutti i file spostati ($finalRows)";
                    break;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeCopyFilesQuery() {
        if ($this->dbConn->connect()) {
            //Preparo ed eseguo la query.
            $stmt = $this->dbConn->prepare("INSERT INTO file (id_directory, nome, tipo, info, mime) "
                    . "SELECT ?, file.nome, file.tipo, file.info, file.mime "
                    . "FROM file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE file.id = ? AND drive.id_utente = ?");

            $in_fileID = 0;
            $in_destDirID = $this->request["destDirID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_destDirID, $in_fileID, $in_userID);

            $countFiles = count($this->request["filesID"]);
            $finalRows = 0;
            $this->response["newFilesID"] = array();

            for ($i = 0; $i < $countFiles; $i++) {
                $in_fileID = (int) $this->request["filesID"][$i];
                $stmt->execute();

                $newFileID = $stmt->insert_id;
                array_push($this->response["newFilesID"], $newFileID);

                if ($stmt->affected_rows != -1) {
                    $finalRows += $stmt->affected_rows;
                } else {
                    $this->code = 4;
                    $this->errorMessage = "Errore nella query: " . $stmt->error;

                    $stmt->close();
                    $this->dbConn->close();
                    return;
                }
            }

            //elaboro risposta.
            switch ($finalRows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun file copiato";
                    break;
                case $countFiles:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Non tutti i file copiati ($finalRows)";
                    break;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeDeleteFilesQuery() {
        if ($this->dbConn->connect()) {
            //Preparo ed eseguo la query.
            $stmt = $this->dbConn->prepare("DELETE file.* "
                    . "FROM file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "WHERE file.id = ? AND drive.id_utente = ?");

            $in_fileID = 0;
            $in_userID = $this->getUserID();

            $stmt->bind_param("ii", $in_fileID, $in_userID);

            $countFiles = count($this->request["filesID"]);
            $finalRows = 0;
            for ($i = 0; $i < $countFiles; $i++) {
                $in_fileID = (int) $this->request["filesID"][$i];
                $stmt->execute();

                if ($stmt->affected_rows != -1) {
                    $finalRows += $stmt->affected_rows;
                } else {
                    $this->code = 5;
                    $this->errorMessage = "Errore nella query: " . $stmt->error;

                    $stmt->close();
                    $this->dbConn->close();
                    return;
                }
            }

            //elaboro risposta.
            switch ($finalRows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun file eliminato";
                    break;
                case $countFiles:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Non tutti i file eliminati ($finalRows)";
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
