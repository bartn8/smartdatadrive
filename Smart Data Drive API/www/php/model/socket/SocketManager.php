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

namespace model\socket;

/**
 * Description of SocketManager
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class SocketManager {

    private $socket;
    private $isConnected;
    private $ipAddress;
    private $servicePort;
    private $requestArray;
    private $responseArray;

    public function __construct() {
        $this->isConnected = false;
    }

    public function initFromConfig() {
        $this->ipAddress = $GLOBALS["ipAddress"];
        $this->servicePort = $GLOBALS["servicePort"];
    }

    function setIpAddress($ipAddress) {
        $this->ipAddress = $ipAddress;
    }

    function setServicePort($servicePort) {
        $this->servicePort = $servicePort;
    }

    public function createSocket() {
        $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    }

    public function isSocketAvailable() {
        if ($this->socket) {
            return true;
        }
        return false;
    }

    public function isConnected() {
        return $this->isConnected;
    }

    public function connectSocket() {
        if (!$this->isConnected) {
            $this->isConnected = socket_connect($this->socket, $this->ipAddress, $this->servicePort);
        }
    }

    public function writeRequest() {
        if ($this->isConnected) {
            $encodedRequestArray = json_encode($this->requestArray) . "\n";
            $resultWrite = socket_write($this->socket, $encodedRequestArray);
            return $resultWrite !== false;
        }
        return false;
    }

    public function readResponse() {
        if ($this->isConnected) {
            $resultRead = socket_read($this->socket, 131072, PHP_NORMAL_READ);
            if ($resultRead !== false) {
                $this->responseArray = json_decode($resultRead, true);
                return true;
            }
        }
        return false;
    }

    public function closeSocket() {
        if ($this->isConnected) {
            socket_close($this->socket);
            $this->isConnected = false;
        }
    }

    function setRequestArray($requestArray) {
        $this->requestArray = $requestArray;
    }

    function getResponseArray() {
        return $this->responseArray;
    }

}
