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

namespace controller;

/**
 * Description of DownloadController
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class DownloadController {

    function __construct() {
        
    }

    public function param_fileID(&$fileID) {
        $fileID = filter_input(INPUT_GET, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return $fileID > 0;
    }

    public function param_asDownload(&$asDownload) {
        $in_asDownload = filter_input(INPUT_GET, "asDownload", FILTER_VALIDATE_BOOLEAN);

        if ($in_asDownload != null) {
            $asDownload = $in_asDownload;
        } else {
            $asDownload = false;
        }
        return true;
    }

}
