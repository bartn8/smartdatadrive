<?php

/* 
 * Copyright (C) 2017 Luca Bartolomei <bartn8@hotmail.it>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

namespace view\ajax;

/**
 * Description of NeuralView
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class JDataView extends \view\View {

    private $data;
    private $code;
    private $errorMessage;

    function __construct() {
        parent::__construct();
        $this->data = array();
    }

    public function addData($key, $value) {
        $this->data[$key] = $value;
    }

    function setData($data) {
        $this->data = $data;
    }

    function setCode($code) {
        $this->code = $code;
    }

    function setErrorMessage($errorMessage) {
        $this->errorMessage = $errorMessage;
    }

    public function printPage() {
        $info = [
            "errorMessage" => $this->errorMessage,
            "code" => $this->code
        ];
        header('Content-Type: application/json');
        echo json_encode(array_merge($info, $this->data));
    }

}
