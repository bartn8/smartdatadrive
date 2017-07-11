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
 * Description of Utente
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Utente extends Table {

    public function __construct() {
        parent::__construct();
    }

    public function executeAccountStatusQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT nome, cognome, nickname, email FROM utente WHERE id = ?");

            $in_userID = $this->getUserID();

            $stmt->bind_param("i", $in_userID);
            $stmt->execute();

            $out_nome = "";
            $out_cognome = "";
            $out_nickname = "";
            $out_email = "";

            $stmt->bind_result($out_nome, $out_cognome, $out_nickname, $out_email);

            $this->response["accountInfo"] = array();

            if ($stmt->fetch()) {
                $this->code = 0;
                $this->response["accountInfo"]["nome"] = $out_nome;
                $this->response["accountInfo"]["cognome"] = $out_cognome;
                $this->response["accountInfo"]["nickname"] = $out_nickname;
                $this->response["accountInfo"]["email"] = $out_email;
                $this->response["accountInfo"]["isLogged"] = true;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->response["accountInfo"] = "Nessun account trovato";
                $this->response["accountInfo"]["isLogged"] = false;
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeLoginQuery() {
        if ($this->dbConn->connect()) {
            $stmtSalt = $this->dbConn->prepare("SELECT salt FROM utente WHERE username = ?");

            $in_username = $this->request["username"];

            $stmtSalt->bind_param("s", $in_username);
            $stmtSalt->execute();

            $out_salt = "";

            $stmtSalt->bind_result($out_salt);

            if (!$stmtSalt->fetch()) {
                $this->code = 2;
                $this->errorMessage = "Nessun account trovato";

                $stmtSalt->close();
                $this->dbConn->close();
                return;
            }

            $stmtSalt->close();

            $hashGen = new \model\com\Hash();
            
            $hashGen->setSalt($out_salt);
            $hashGen->setStr($this->request["password"]);
            $hashGen->calcolateHash();

            //Vero login-------------------------------------------------------
            $stmt = $this->dbConn->prepare("SELECT id, nome, cognome, nickname, email FROM utente WHERE username = ? AND password = ?");

            $in_hash = $hashGen->getHash();

            $stmt->bind_param("ss", $in_username, $in_hash);
            $stmt->execute();

            $out_userID = 0;
            $out_nome = "";
            $out_cognome = "";
            $out_nickname = "";
            $out_email = "";

            $stmt->bind_result($out_userID, $out_nome, $out_cognome, $out_nickname, $out_email);

            $this->response["accountInfo"] = array();
            
            if ($stmt->fetch()) {
                $this->code = 0;
                $this->response["userID"] = $out_userID;
                $this->response["accountInfo"] = array();
                $this->response["accountInfo"]["nome"] = $out_nome;
                $this->response["accountInfo"]["cognome"] = $out_cognome;
                $this->response["accountInfo"]["nickname"] = $out_nickname;
                $this->response["accountInfo"]["email"] = $out_email;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun account trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

    public function executeRegistrationQuery() {
        if ($this->dbConn->connect()) {
            $this->dbConn->setAutocommit(false);

            $stmt = $this->dbConn->prepare("INSERT INTO utente (nome, cognome, nickname, email, username, password, salt) "
                    . "VALUES (?, ?, ?, ?, ?, ? ,?)");

            $hashGen = new \model\com\Hash();
            $hashGen->setStr($this->request["password"]);
            $hashGen->generateSalt();
            $hashGen->calcolateHash();

            $in_nome = $this->request["nome"];
            $in_cognome = $this->request["cognome"];
            $in_nickname = $this->request["nickname"];
            $in_email = $this->request["email"];
            $in_username = $this->request["username"];
            $in_hash = $hashGen->getHash();
            $in_salt = $hashGen->getSalt();

            $stmt->bind_param("sssssss", $in_nome, $in_cognome, $in_nickname, $in_email, $in_username, $in_hash, $in_salt);

            $result = $stmt->execute();

            $out_userID = 0;

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
                    $this->errorMessage = "Nessun account inserito";
                    $stmt->close();
                    $this->dbConn->close();
                    return;
                case 1:
                    $this->code = 0;
                    $out_userID = $stmt->insert_id;
                    break;
                default:
                    $this->code = 3;
                    $this->errorMessage = "Errore nelle righe: ($stmt->affected_rows)";
                    $stmt->close();
                    $this->dbConn->close();
                    return;
            }


            //Inserimento drive
            $stmtDrive = $this->dbConn->prepare("INSERT INTO drive (id_utente, nome) "
                    . "VALUES (?, ?)");

            $in_userID = $out_userID;
            $in_nomeDrive = $this->request["driveNome"];

            $stmtDrive->bind_param("is", $in_userID, $in_nomeDrive);

            $resultDrive = $stmtDrive->execute();

            $out_driveID = 0;

            if (!$resultDrive) {
                $this->code = 4 * 100;
                $this->errorMessage = "Errore SQL: " . $stmtDrive->error;
                $stmtDrive->close();
                $this->dbConn->close();
                return;
            }

            switch ($stmtDrive->affected_rows) {
                case 0:
                    $this->code = 2 * 100;
                    $this->errorMessage = "Nessun drive inserito";
                    $stmtDrive->close();
                    $this->dbConn->close();
                    return;
                case 1:
                    $this->code = 0;
                    $out_driveID = $stmtDrive->insert_id;
                    break;
                default:
                    $this->code = 3 * 100;
                    $stmtDrive->errorMessage = "Errore nelle righe: ($stmtDrive->affected_rows)";
                    $stmtDrive->close();
                    $this->dbConn->close();
                    return;
            }



            //Inserimento root.
            $stmtRoot = $this->dbConn->prepare("INSERT INTO directory (id_drive, nome, path) "
                    . "VALUES (?, ?, ?)");

            $in_driveID = $out_driveID;
            $in_nomeRoot = $this->request["driveNome"];
            $in_path = "~/";

            $stmtRoot->bind_param("iss", $in_driveID, $in_nomeRoot, $in_path);

            $resultRoot = $stmtRoot->execute();

            if (!$resultRoot) {
                $this->code = 4 * 1000;
                $this->errorMessage = "Errore SQL: " . $stmtRoot->error;
                $stmtRoot->close();
                $this->dbConn->close();
                return;
            }

            switch ($stmtRoot->affected_rows) {
                case 0:
                    $this->code = 2 * 1000;
                    $this->errorMessage = "Nessuna root inserita";
                    $stmtRoot->close();
                    $this->dbConn->close();
                    return;
                case 1:
                    $this->code = 0;
                    $this->response["return"] = true;
                    break;
                default:
                    $this->code = 3 * 1000;
                    $stmtRoot->errorMessage = "Errore nelle righe: ($stmtRoot->affected_rows)";
                    $stmtRoot->close();
                    $this->dbConn->close();
                    return;
            }

            $stmt->close();
            $stmtDrive->close();
            $stmtRoot->close();

            $this->dbConn->commit();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}