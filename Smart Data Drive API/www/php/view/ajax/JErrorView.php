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

namespace view\ajax;

/**
 * Description of ErrorView
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class JErrorView extends \view\View {

    private $errorMessage;
    private $code;

    function __construct() {
        parent::__construct();
        $this->code = -1000;
        $this->errorMessage = "";
    }

    function setErrorMessage($errorMessage) {
        $this->errorMessage = $errorMessage;
    }

    function setCode($code) {
        $this->code = $code;
    }

    public function printPage() {
        $allData = ["errorMessage" => $this->errorMessage, "code" => $this->code];
        header('Content-Type: application/json');
        echo json_encode($allData);
    }

    public function printError($error) {
        $allData = ["errorMessage" => $error, "code" => $this->code];
        header('Content-Type: application/json');
        echo json_encode($allData);
    }
    
    public function printErrorCode($error, $code){
        $allData = ["errorMessage" => $error, "code" => $code];
        header('Content-Type: application/json');
        echo json_encode($allData);
    }
            

}
