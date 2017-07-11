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

namespace view\download;

/**
 * Description of DownloadView
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class DownloadView extends \view\View {

    private $fileName;
    private $fileType;
    private $fileMIME;
    private $data;
    private $asDownload;

    function __construct() {
        parent::__construct();
        $this->data = "";
        $this->fileName = "";
        $this->fileType = "";
        $this->fileMIME = "binary/octet-stream";
        $this->asDownload = true;
    }

    function setAsDownload($asDownload) {
        $this->asDownload = $asDownload;
    }

    function setFileMIME($fileMIME) {
        $this->fileMIME = $fileMIME;
    }

    function setFileName($fileName) {
        $this->fileName = $fileName;
    }

    function setFileType($fileType) {
        $this->fileType = $fileType;
    }

    function setData($data) {
        $this->data = $data;
    }

    public function printHeader() {
        if ($this->asDownload) {
            header("Cache-Control: public");
            header("Content-Description: File Transfer");
            header("Content-Disposition: attachment; filename=\"$this->fileName.$this->fileType\"");
            header("Content-Transfer-Encoding: binary");
        }
        header("Content-Type: $this->fileMIME");
    }
    
    public function printData($data){
        echo $data;
    }

}
