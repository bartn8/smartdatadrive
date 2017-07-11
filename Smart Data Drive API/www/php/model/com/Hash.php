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
 * Description of Hash
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Hash {

    private $algo;
    private $str;
    private $salt;
    private $hash;
    private $saltLength;

    function __construct() {
        $this->algo = $GLOBALS["defaultHashAlgorithm"];
        $this->str = "";
        $this->salt = "";
        $this->hash = "";
        $this->saltLength = 16;
    }

    function getSalt() {
        return $this->salt;
    }

    function getHash() {
        return $this->hash;
    }

    function getSaltLength() {
        return $this->saltLength;
    }

    function setStr($str) {
        $this->str = $str;
    }

    function setSalt($salt) {
        $this->salt = $salt;
    }

    function setSaltLength($saltLength) {
        $this->saltLength = $saltLength;
    }

    function generateSalt() {
        $binSalt = openssl_random_pseudo_bytes($this->saltLength / 2);
        $this->salt = bin2hex($binSalt);
    }

    function calcolateHash() {
        $this->hash = hash($this->algo, "$this->str$this->salt");
    }

}
