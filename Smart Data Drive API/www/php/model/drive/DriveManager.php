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

namespace model\drive;

/**
 * Description of DriveManager
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class DriveManager {

    private $pathToDrives;
    private $download;
    private $file;
    private $isOpened;

    public function __construct() {
        $this->pathToDrives = $GLOBALS["drivesDir"];
        $this->download = array();
        $this->isOpened = false;
    }

    function setPathToDrives($pathToDrives) {
        $this->pathToDrives = $pathToDrives;
    }

    function getDownload() {
        return $this->download;
    }

    public function downloadFile($fileID) {
        $fileTable = new \model\db\table\FileInfo();
        $fileTable->init();
        $fileTable->setRequest(["fileID" => $fileID]);
        $fileTable->executeFileInfoQuery();

        if ($fileTable->getResponse()["return"]) {
            $finalPath = "$this->pathToDrives$fileID";
            $fileName = $fileTable->getResponse()["fileInfo"]["name"];
            $fileType = $fileTable->getResponse()["fileInfo"]["type"];
            $fileMIME = $fileTable->getResponse()["fileInfo"]["mime"];
            $fileHash = $fileTable->getResponse()["fileInfo"]["fileHash"];
            $hashFunction = $fileTable->getResponse()["fileInfo"]["hashFunction"];

            if (\file_exists($finalPath)) {
                //CRC
                $downloadHash = hash_file($hashFunction, $finalPath);
                if ($downloadHash === $fileHash) {
                    //Lettura fisica
                    $file = \fopen($finalPath, "rb");
                    $read = \fread($file, \filesize($finalPath));
                    \fclose($file);

                    if ($read !== false) {
                        //scrittura delle informazioni su array.
                        $this->download["data"] = $read;
                        $this->download["name"] = $fileName;
                        $this->download["type"] = $fileType;
                        $this->download["mime"] = $fileMIME;
                        return 0;
                    } else {
                        return -4;
                    }
                } else {
                    return -5;
                }
            } else {
                return -3;
            }
        }
        return -1;
    }

    public function openFile($fileID) {
        if (!$this->isOpened) {
            $fileTable = new \model\db\table\FileInfo();
            $fileTable->init();
            $fileTable->setRequest(["fileID" => $fileID]);
            $fileTable->executeFileInfoQuery();

            if ($fileTable->getResponse()["return"]) {
                
            }
        }
    }

    public function partialDownloadFile() {
        if ($this->isOpened) {
            
        }
    }

    public function closeFile() {
        if ($this->isOpened) {
            
        }
    }

    public function uploadFile($fileID, $filePathTmp) {
        $fileTable = new \model\db\table\FileInfo();
        $fileTable->init();
        $fileTable->setRequest(["fileID" => $fileID]);
        $fileTable->executeIsFileIDValid();

        if ($fileTable->getResponse()["return"]) {
            if ($fileTable->getResponse()["isFileIDValid"]) {
                $finalPath = "$this->pathToDrives$fileID";
                if (\move_uploaded_file($filePathTmp, $finalPath)) {
                    return \chmod($finalPath, 0660) ? 0 : -4;
                } else {
                    return -2;
                }
            } else {
                return -3;
            }
        } else {
            return -1;
        }
    }

    public function copyFile($fileID, $newFileID) {
        $fileTable = new \model\db\table\FileInfo();
        $fileTable->init();
        $fileTable->setRequest(["fileID" => $fileID]);
        $fileTable->executeIsFileIDValid();

        $possoProcedere = $fileTable->getResponse()["return"] && $fileTable->getResponse()["isFileIDValid"];

        $fileTable->clearResponse();
        $fileTable->setRequest(["fileID" => $newFileID]);
        $fileTable->executeIsFileIDValid();

        $possoProcedere &= $fileTable->getResponse()["return"] && $fileTable->getResponse()["isFileIDValid"];

        $originalFilePath = "$this->pathToDrives$fileID";
        $newFilePath = "$this->pathToDrives$newFileID";

        if ($possoProcedere) {
            if (\copy($originalFilePath, $newFilePath)) {
                return 0;
            } else {
                return -3;
            }
        } else {
            return -2;
        }
        return -1;
    }

    public function removeFile($fileID) {
        $fileTable = new \model\db\table\FileInfo();
        $fileTable->init();
        $fileTable->setRequest(["fileID" => $fileID]);
        $fileTable->executeIsFileIDValid();

        $possoProcedere = $fileTable->getResponse()["return"] && $fileTable->getResponse()["isFileIDValid"];
        $finalPath = "$this->pathToDrives$fileID";

        if ($possoProcedere) {
            if (\file_exists($finalPath)) {
                return \unlink($finalPath) ? 0 : -3;
            } else {
                return -2;
            }
        }
        return -1;
    }

}
