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
 * Description of DBInfo
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class DBInfo {

    private $serverURL;
    private $username;
    private $password;
    private $dbName;

    function __construct() {
        $this->serverURL = $GLOBALS["mysqlServerURL"];
        $this->username = $GLOBALS["mysqlUsername"];
        $this->password = $GLOBALS["mysqlPassword"];
        $this->dbName = $GLOBALS["mysqlDbName"];
    }

    function getServerURL() {
        return $this->serverURL;
    }

    function getUsername() {
        return $this->username;
    }

    function getPassword() {
        return $this->password;
    }

    function getDBName() {
        return $this->dbName;
    }

}
