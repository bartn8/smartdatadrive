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
 * Description of Table
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Table {

    protected $dbConn;
    protected $context;
    protected $code;
    protected $errorMessage;
    protected $request;
    protected $response;
    protected $useContextForUserID;

    public function __construct() {
        $this->dbConn = new \model\db\DBConnection();
        $this->context = new \model\com\Context();
        $this->code = 0;
        $this->errorMessage = "";
        $this->request = array();
        $this->response = array();
        $this->response["return"] = false;
        $this->useContextForUserID = true;
    }

    public function init() {
        $this->context->loadSession();
    }

    public function getCode() {
        return $this->code;
    }

    public function getErrorMessage() {
        return $this->errorMessage;
    }

    public function getResponse() {
        return $this->response;
    }

    public function setRequest($request) {
        $this->request = $request;
    }

    public function setUseContextForUserID($useContextForUserID) {
        $this->useContextForUserID = $useContextForUserID;
    }
    
    public function clearResponse(){
        $this->response = array();
    }

    protected function getUserID() {
        if ($this->useContextForUserID) {
            return $this->context->getUserID();
        } else {
            return $this->request["userID"];
        }
    }

}
