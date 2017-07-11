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

namespace mvc;

/**
 * Description of Download
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Download {

    private $view;
    private $errorView;
    private $context;
    private $controller;
    private $driveManager;

    function __construct() {
        $this->context = new \model\com\Context();
        $this->view = new \view\download\DownloadView();
        $this->errorView = new \view\com\HErrorView();
        $this->controller = new \controller\DownloadController();
        $this->driveManager = new \model\drive\DriveManager();
    }

    public function load() {
        $this->context->loadSession();
    }

    public function executeCommand() {
        $fileID = 0;
        $asDownload = false;

        $param1 = $this->controller->param_fileID($fileID);
        $param2 = $this->controller->param_asDownload($asDownload);

        if ($param1 && $param2) {
            if ($this->context->isLogged()) {
                $result = $this->driveManager->downloadFile($fileID);
                if ($result == 0) {
                    $download = $this->driveManager->getDownload();

                    $this->view->setAsDownload($asDownload);
                    $this->view->setFileName($download["name"]);
                    $this->view->setFileType($download["type"]);
                    $this->view->setFileMIME($download["mime"]);
                    $this->view->setData($download["data"]);
                    $this->view->printPage();
                } else {
                    $this->errorView->setErrorMessage("Errore nel recupero del file ($result)");
                    $this->errorView->printPage();
                }
            } else {
                $this->errorView->setErrorMessage("Non loggato!");
                $this->errorView->printPage();
            }
        } else {
            $this->errorView->setErrorMessage("input non validi");
            $this->errorView->printPage();
        }
    }

}
