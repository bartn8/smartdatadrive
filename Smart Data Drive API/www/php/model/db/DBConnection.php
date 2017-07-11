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

namespace model\db;

/**
 * Consente la connessione ad un database e l' invio di query.
 *
 * @author luca
 */
class DBConnection {

    private $dbInfo;
    private $conn;
    private $isConnected;

    function __construct() {
        $this->dbInfo = new DBInfo();
        $this->isConnected = false;
    }

    public function connect() {
        //creo connessione
        $this->conn = new \mysqli($this->dbInfo->getServerURL(), $this->dbInfo->getUsername(), $this->dbInfo->getPassword(), $this->dbInfo->getDBName());
        //verifica
        $this->isConnected = $this->conn->connect_errno == 0;

        return $this->isConnected();
    }

    public function getConnectionError() {
        return $this->conn->connect_error;
    }

    function isConnected() {
        return $this->isConnected;
    }

    public function close() {
        if ($this->conn != null) {
            $this->conn->close();
        }
    }

    public function setAutocommit($bool) {
        if ($this->conn != null) {
            $this->conn->autocommit($bool);
        }
    }
    
    public function commit() {
        if ($this->conn != null) {
            $this->conn->commit();
        }
    }

    /**
     * Consente di preparare una sql.
     * Ricordarsi di creare la connessione prima!
     * 
     * @param type $sql query sql
     * @return type Statement contenente l' oggetto sql.
     */
    public function prepare($sql) {
        return $this->conn->prepare($sql);
    }

}
