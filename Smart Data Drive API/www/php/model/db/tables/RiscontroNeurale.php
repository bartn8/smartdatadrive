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
 * Description of RiscontroNeurale
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class RiscontroNeurale extends Table {

    function __construct() {
        parent::__construct();
    }

    public function executeDeleteRiscontroNeuraleQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("DELETE rsc.* "
                    . "FROM riscontro_neurale AS rsc "
                    . "INNER JOIN file ON file.id = rsc.id_file "
                    . "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    . "INNER JOIN drive ON drive.id = dir.id_drive "
                    . "INNER JOIN rete_neurale AS rtn ON rtn.id = rsc.id_rete "
                    . "WHERE rtn.id_tag = ? AND rsc.id_file = ? AND drive.id_utente = ?");

            $in_tagID = $this->request["tagID"];
            $in_fileID = $this->request["fileID"];
            $in_userID = $this->getUserID();

            $stmt->bind_param("iii", $in_tagID, $in_fileID, $in_userID);
            $stmt->execute();

            switch ($stmt->affected_rows) {
                case 0:
                    $this->code = 2;
                    $this->errorMessage = "Nessun riscontro eliminato";
                    break;
                case 1:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Troppi riscontri eliminati ($stmt->affected_rows)";
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
