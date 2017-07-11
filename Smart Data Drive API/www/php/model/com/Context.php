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

namespace model\com;

/**
 * Description of Contex
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Context {

    private $userID;
    private $logged;

    function __construct() {
        $this->userID = "";
        $this->logged = FALSE;
    }

    public function loadSession() {
        if (session_status() == PHP_SESSION_ACTIVE) {
            if (array_key_exists("logged", $_SESSION)) {
                $this->logged = $_SESSION["logged"];
            }
            if (array_key_exists("userID", $_SESSION)) {
                $this->userID = $_SESSION["userID"];
            }
        }
    }

    public function saveSession() {
        if (session_status() == PHP_SESSION_ACTIVE) {
            $_SESSION["logged"] = $this->logged;
            $_SESSION["userID"] = $this->userID;
            return true;
        } else {
            return false;
        }
    }
    
    public function isSessionActive(){
        return session_status() == PHP_SESSION_ACTIVE;
    }

    function getUserID() {
        return $this->userID;
    }

    function setUserID($userID) {
        $this->userID = $userID;
    }

    function isLogged() {
        return $this->logged;
    }

    function setLogged($logged) {
        $this->logged = $logged;
    }

}
