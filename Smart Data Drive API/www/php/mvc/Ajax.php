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
 * Description of Ajax
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Ajax {

    //Model
    private $context;
    //View
    private $errorView;
    private $dataView;
    //Controller
    private $controller;
    //Data
    private $command;

    public function __construct() {
        $this->dataView = new \view\ajax\JDataView();
        $this->errorView = new \view\ajax\JErrorView();
        $this->context = new \model\com\Context();
        $this->controller = new \controller\AjaxController();
        $this->command = "";
    }

    public function load() {
        $this->context->loadSession();
        $this->controller->param_command($this->command);
    }

    public function executeCommand() {
        if ($this->context->isLogged()) {
            switch ($this->command) {
                case "addFileTagLink":
                    $this->command_addFileTagLink();
                    break;
                case "removeFileTagLink":
                    $this->command_removeFileTagLink();
                    break;
                case "createTag":
                    $this->command_createTag();
                    break;
                case "getFileTags": //Restituisce i tags di un file
                    $this->command_getFileTags();
                    break;
                case "getDirTags": //Restituisce i tags dei file presenti in una cartella
                    $this->command_getDirTags();
                    break;
                case "getTags":
                    $this->command_getTags();
                    break;
                case "changeInfoFile":
                    $this->command_changeInfoFile();
                    break;
                case "renameFile":
                    $this->command_renameFile();
                    break;
                case "deleteFile":
                    $this->command_deleteFile();
                    break;
                case "cutFiles":
                    $this->command_cutFiles();
                    break;
                case "copyFiles":
                    $this->command_copyFiles();
                    break;
                case "deleteFiles":
                    $this->command_deleteFiles();
                    break;
                case "lsFile":
                    $this->command_lsFile();
                    break;
                case "filteredLsFile":
                    $this->command_filteredLsFile();
                    break;
                case "fileInfo":
                    $this->command_fileInfo();
                    break;
                case "lsDir":
                    $this->command_lsDir();
                    break;
                case "logout":
                    $this->command_logout();
                    break;
                case "accountStatus":
                    $this->command_accountStatus();
                    break;
                case "getRoot":
                    $this->command_getRoot();
                    break;
                case "uploadFiles":
                    $this->command_uploadFiles();
                    break;
                case "mkDir":
                    $this->command_mkDir();
                    break;
                case "getUpperDir":
                    $this->command_getUpperDir();
                    break;
                case "deleteNeuralDataset":
                    $this->command_deleteNeuralDataset();
                    break;
                case "getNeuralDatasets":
                    $this->command_getNeuralDatasets();
                    break;
                case "getNeuralInfo":
                    $this->command_getNeuralInfo();
                    break;
                case "getPresets":
                    $this->command_getPresets();
                    break;
                case "analyzeFile":
                    $this->command_analyzeFile();
                    break;
                case "addDataset":
                    $this->command_addDataset();
                    break;
                case "getSuggestedTags":
                    $this->command_getSuggestedTags();
                    break;
                case "delSuggestedTag":
                    $this->command_delSuggestedTag();
                    break;
                case "addPositiveFeedback":
                    $this->command_addPositiveFeedback();
                    break;
                case "addNegativeFeedback":
                    $this->command_addNegativeFeedback();
                    break;
                default: //Comando non riconosciuto!!!
                    $this->errorView->printError("comando non riconosciuto ($this->command)");
                    break;
            }
        } else {
            //Comandi senza essere loggato
            switch ($this->command) {
                case "login":
                    $this->command_login();
                    break;
                case "registration":
                    $this->command_registration();
                    break;
                case "accountStatus":
                    $this->command_accountStatus();
                    break;
                default:
                    $this->errorView->printError("non loggato");
                    break;
            }
        }
    }

    private function command_addFileTagLink() {
        $fileID = 0;
        $tagID = 0;
        $param = $this->controller->param_addFileTagLink($tagID, $fileID);

        if ($param) {
            $fileTagLinkTable = new \model\db\table\FileTagLink();
            $fileTagLinkTable->init();
            $fileTagLinkTable->setRequest([
                "fileID" => $fileID,
                "tagID" => $tagID
            ]);

            $fileTagLinkTable->executeAddFileTagLinkQuery();

            $this->dataView->addData("fileTagLink", $fileTagLinkTable->getResponse()["fileTagLink"]);
            $this->dataView->setCode($fileTagLinkTable->getCode());
            $this->dataView->setErrorMessage($fileTagLinkTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_removeFileTagLink() {
        $fileID = 0;
        $tagID = 0;
        $param = $this->controller->param_removeFileTagLink($tagID, $fileID);

        if ($param) {
            $fileTagLinkTable = new \model\db\table\FileTagLink();
            $fileTagLinkTable->init();
            $fileTagLinkTable->setRequest([
                "fileID" => $fileID,
                "tagID" => $tagID
            ]);

            $fileTagLinkTable->executeRemoveFileTagLinkQuery();

            $this->dataView->setCode($fileTagLinkTable->getCode());
            $this->dataView->setErrorMessage($fileTagLinkTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_createTag() {
        $tagName = "";
        $tagDesc = "";
        $isTagShareable = false;
        $tagIDParent = 0;

        $param = $this->controller->param_createTag($tagName, $tagDesc, $isTagShareable, $tagIDParent);

        if ($param) {
            $tagTable = new \model\db\table\Tag();
            $tagTable->init();
            $tagTable->setRequest([
                "tagName" => $tagName,
                "tagDesc" => $tagDesc,
                "isTagShareable" => $isTagShareable,
                "tagIDParent" => $tagIDParent
            ]);

            $tagTable->executeTagCreationQuery();

            $this->dataView->addData("tag", $tagTable->getResponse()["tag"]);
            $this->dataView->setCode($tagTable->getCode());
            $this->dataView->setErrorMessage($tagTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getFileTags() {
        $fileID = 0;
        $param = $this->controller->param_getFileTags($fileID);

        if ($param) {
            $tagTable = new \model\db\table\Tag();
            $tagTable->init();
            $tagTable->setRequest([
                "fileID" => $fileID
            ]);

            $tagTable->executeGetFileTagsQuery();

            $this->dataView->addData("tags", $tagTable->getResponse()["tags"]);
            $this->dataView->setCode($tagTable->getCode());
            $this->dataView->setErrorMessage($tagTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getDirTags() {
        $dirID = 0;
        $param = $this->controller->param_getDirTags($dirID);

        if ($param) {
            $tagTable = new \model\db\table\Tag();
            $tagTable->init();
            $tagTable->setRequest([
                "dirID" => $dirID
            ]);

            $tagTable->executeGetDirTagsQuery();

            $this->dataView->addData("tags", $tagTable->getResponse()["tags"]);
            $this->dataView->setCode($tagTable->getCode());
            $this->dataView->setErrorMessage($tagTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getTags() {
        $tagTable = new \model\db\table\Tag();
        $tagTable->init();

        $tagTable->executeGetTagsQuery();

        $this->dataView->addData("tags", $tagTable->getResponse()["tags"]);
        $this->dataView->setCode($tagTable->getCode());
        $this->dataView->setErrorMessage($tagTable->getErrorMessage());
        $this->dataView->printPage();
    }

    private function command_renameFile() {
        $fileID = 0;
        $newName = "";

        $param = $this->controller->param_renameFile($newName, $fileID);

        if ($param) {
            $fileTable = new \model\db\table\File();
            $fileTable->init();
            $fileTable->setRequest([
                "fileID" => $fileID,
                "newName" => $newName
            ]);

            $fileTable->executeRenameFileQuery();

            $this->dataView->setCode($fileTable->getCode());
            $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_changeInfoFile() {
        $fileInfo = "";
        $fileID = 0;

        $param = $this->controller->param_changeInfoFile($fileInfo, $fileID);

        if ($param) {
            $fileTable = new \model\db\table\File();
            $fileTable->init();
            $fileTable->setRequest([
                "fileInfo" => $fileInfo,
                "fileID" => $fileID
            ]);

            $fileTable->executeChangeFileInfoQuery();

            $this->dataView->setCode($fileTable->getCode());
            $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_deleteFile() {
        //Rimozione fisica!
        $fileID = 0;

        $param = $this->controller->param_deleteFile($fileID);

        if ($param) {
            $driveManager = new \model\drive\DriveManager();
            $result = $driveManager->removeFile($fileID);

            if ($result == 0) {
                $fileTable = new \model\db\table\File();
                $fileTable->init();
                $fileTable->setRequest([
                    "fileID" => $fileID
                ]);

                $fileTable->executeDeleteFileQuery();

                $this->dataView->setCode($fileTable->getCode());
                $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            } else {
                $this->errorView->printErrorCode("Errore I/O ($result)", 1);
                return;
            }

            $this->dataView->printPage();
        }
    }

    private function command_cutFiles() {
        $filesID = array();
        $destDirID = 0;

        $param = $this->controller->param_cutFiles($filesID, $destDirID);

        if ($param) {
            $fileTable = new \model\db\table\File();
            $fileTable->init();
            $fileTable->setRequest([
                "filesID" => $filesID,
                "destDirID" => $destDirID
            ]);

            $fileTable->executeCutFilesQuery();

            $this->dataView->setCode($fileTable->getCode());
            $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_copyFiles() {
        $filesID = array();
        $destDirID = 0;

        $param = $this->controller->param_copyFiles($filesID, $destDirID);

        if ($param) {
            $fileTable = new \model\db\table\File();
            $fileTable->init();
            $fileTable->setRequest([
                "filesID" => $filesID,
                "destDirID" => $destDirID
            ]);

            $fileTable->executeCopyFilesQuery();

            if ($fileTable->getResponse()["return"]) {
                $newFilesID = $fileTable->getResponse()["newFilesID"];

                for ($i = 0; $i < count($newFilesID); $i++) {
                    if ($newFilesID[$i] > 0) {
                        $driveManager = new \model\drive\DriveManager();
                        $result = $driveManager->copyFile($filesID[$i], $newFilesID[$i]);
                        if ($result != 0) {
                            //TODO rimozione file DB
                            $this->errorView->printErrorCode("Errore I/O ($result) DB (" . $this->filesOptionsData->getErrorMessage() . ")", 1);
                            return;
                        }
                    }
                }
            }

            $this->dataView->setCode($fileTable->getCode());
            $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_deleteFiles() {
        $filesID = array();

        $param = $this->controller->param_deleteFiles($filesID);

        if ($param) {
            for ($i = 0; $i < count($filesID); $i++) {
                $driveManager = new \model\drive\DriveManager();
                $result = $driveManager->removeFile($filesID[$i]);
                if ($result != 0) {
                    $this->errorView->printErrorCode("Errore I/O ($result)", 1);
                    return;
                }
            }

            $fileTable = new \model\db\table\File();
            $fileTable->init();
            $fileTable->setRequest([
                "filesID" => $filesID
            ]);

            $fileTable->executeDeleteFilesQuery();

            $this->dataView->setCode($fileTable->getCode());
            $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_lsFile() {
        $dirID = 0;
        $param = $this->controller->param_lsFile($dirID);

        if ($param) {
            $lsFileTable = new \model\db\table\LsFile();
            $lsFileTable->init();
            $lsFileTable->setRequest([
                "dirID" => $dirID
            ]);

            $lsFileTable->executeLsFileQuery();

            $this->dataView->addData("lsFile", $lsFileTable->getResponse()["lsFile"]);
            $this->dataView->setCode($lsFileTable->getCode());
            $this->dataView->setErrorMessage($lsFileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_fileInfo() {
        $fileID = 0;
        $param = $this->controller->param_FileInfo($fileID);

        if ($param) {
            $fileInfoTable = new \model\db\table\FileInfo();
            $fileInfoTable->init();
            $fileInfoTable->setRequest([
                "fileID" => $fileID
            ]);
            $fileInfoTable->executeFileInfoQuery();

            $this->dataView->addData("fileInfo", $fileInfoTable->getResponse()["fileInfo"]);
            $this->dataView->setCode($fileInfoTable->getCode());
            $this->dataView->setErrorMessage($fileInfoTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_accountStatus() {
        if ($this->context->isLogged()) {
            $utenteTable = new \model\db\table\Utente();
            $utenteTable->init();
            $utenteTable->executeAccountStatusQuery();

            $accountInfo = $utenteTable->getResponse()["accountInfo"];

            if (!$accountInfo["isLogged"]) {
                $this->context->setLogged(false);
                $this->context->setUserID(0);
                $this->context->saveSession();
            }

            $this->dataView->addData("accountInfo", $accountInfo);
            $this->dataView->setCode($utenteTable->getCode());
            $this->dataView->setErrorMessage($utenteTable->getErrorMessage());
            $this->dataView->printPage();
        } else {
            $defaultInfo = array();
            $defaultInfo["isLogged"] = false;

            $this->dataView->addData("accountInfo", $defaultInfo);
            $this->dataView->setCode(0);
            $this->dataView->setErrorMessage("");
            $this->dataView->printPage();
        }
    }

    private function command_login() {
        $username = "";
        $password = "";

        $param = $this->controller->param_login($username, $password);

        if ($param) {
            $utenteTable = new \model\db\table\Utente();
            $utenteTable->init();
            $utenteTable->setRequest([
                "username" => $username,
                "password" => $password
            ]);

            $utenteTable->executeLoginQuery();

            $accountInfo = $utenteTable->getResponse()["accountInfo"];

            if ($utenteTable->getResponse()["userID"] > 0) {
                $this->context->setLogged(TRUE);
                $this->context->setUserID($utenteTable->getResponse()["userID"]);
                $this->context->saveSession();
                $accountInfo["isLogged"] = true;
            }

            $this->dataView->addData("accountInfo", $accountInfo);
            $this->dataView->setCode($utenteTable->getCode());
            $this->dataView->setErrorMessage($utenteTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    /**
     * Metodo che effettua la registrazione di un nuovo utente.
     * Se la registrazione avrà successo l' utente potrà loggare in un secondo momento.
     * 
     * @param type $nome
     * @param type $cognome
     * @param type $nickname
     * @param type $email
     * @param type $username
     * @param type $password
     */
    private function command_registration() {
        $nome = "";
        $cognome = "";
        $nickname = "";
        $email = "";
        $username = "";
        $password = "";
        $driveNome = "";
        $param = $this->controller->param_registration($nome, $cognome, $nickname, $email, $username, $password, $driveNome);

        if ($param) {
            $utenteTable = new \model\db\table\Utente();
            $utenteTable->init();
            $utenteTable->setRequest([
                "nome" => $nome,
                "cognome" => $cognome,
                "nickname" => $nickname,
                "email" => $email,
                "username" => $username,
                "password" => $password,
                "driveNome" => $driveNome
            ]);

            $utenteTable->executeRegistrationQuery();

            $accountInfo = $utenteTable->getResponse()["accountInfo"];

            $this->dataView->addData("accountInfo", $accountInfo);
            $this->dataView->setCode($utenteTable->getCode());
            $this->dataView->setErrorMessage($utenteTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_logout() {
        $this->context->setLogged(false);
        $this->context->setUserID(0);
        $this->context->saveSession();

        $defaultInfo = array();
        $defaultInfo["isLogged"] = false;

        $this->dataView->addData("accountInfo", $defaultInfo);
        $this->dataView->setCode(0);
        $this->dataView->setErrorMessage("");
        $this->dataView->printPage();
    }

    private function command_lsDir() {
        $dirID = 0;
        $param = $this->controller->param_lsDir($dirID);

        if ($param) {
            $dirTable = new \model\db\table\Directory();
            $dirTable->init();
            $dirTable->setRequest([
                "dirIDParent" => $dirID
            ]);

            $dirTable->executeLsDirQuery();

            $this->dataView->addData("lsDir", $dirTable->getResponse()["lsDir"]);
            $this->dataView->setCode($dirTable->getCode());
            $this->dataView->setErrorMessage($dirTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getRoot() {
        $dirTable = new \model\db\table\Directory();
        $dirTable->init();
        $dirTable->executeGetRootQuery();

        $this->dataView->addData("rootDir", $dirTable->getResponse()["rootDir"]);
        $this->dataView->setCode($dirTable->getCode());
        $this->dataView->setErrorMessage($dirTable->getErrorMessage());
        $this->dataView->printPage();
    }

    private function command_mkDir() {
        $dirIDParent = 0;
        $dirName = "";
        $param = $this->controller->param_mkDir($dirIDParent, $dirName);


        if ($param) {
            $dirTable = new \model\db\table\Directory();
            $dirTable->init();
            $dirTable->setRequest([
                "dirName" => $dirName,
                "dirIDParent" => $dirIDParent
            ]);

            $dirTable->executeMkDirQuery();

            $this->dataView->addData("mkDir", $dirTable->getResponse()["mkDir"]);
            $this->dataView->setCode($dirTable->getCode());
            $this->dataView->setErrorMessage($dirTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getUpperDir() {
        $dirID = 0;
        $param = $this->controller->param_getUpperDir($dirID);

        if ($param) {
            $dirTable = new \model\db\table\Directory();
            $dirTable->init();
            $dirTable->setRequest([
                "dirID" => $dirID,
            ]);

            $dirTable->executeGetUpperDirQuery();

            $this->dataView->addData("upperDir", $dirTable->getResponse()["upperDir"]);
            $this->dataView->setCode($dirTable->getCode());
            $this->dataView->setErrorMessage($dirTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_uploadFiles() {
        $dirID = 0;
        $fileTmp = "";
        $fileName = "";
        $fileType = "";
        $fileMIME = "";
        $fileHash = "";
        $fileThumbnail = ""; //TODO implementazione thumbnail
        $result = array();
        $param = $this->controller->param_uploadFile($dirID, $fileTmp, $fileName, $fileType, $fileMIME, $fileHash, $fileThumbnail, $result);

        if ($param) {
            $fileTable = new \model\db\table\File();
            $fileTable->init();
            $fileTable->setRequest([
                "dirID" => $dirID,
                "fileName" => $fileName,
                "fileType" => $fileType,
                "fileMIME" => $fileMIME,
                "fileHash" => $fileHash
            ]);

            $fileTable->executeInsertFileQuery();

            if ($fileTable->getResponse()["return"]) {
                $fileID = $fileTable->getResponse()["fileID"];

                if ($fileID > 0) {
                    //Posso procedere fisicamente.
                    $driveManager = new \model\drive\DriveManager();
                    $result = $driveManager->uploadFile($fileID, $fileTmp);
                    if ($result != 0) {
                        //TODO $this->fileUploadData->executeUndoInsertFileQuery();
                        $this->errorView->printErrorCode("Errore I/O ($result)", 1);
                        return;
                    }
                }
            }

            $this->dataView->setCode($fileTable->getCode());
            $this->dataView->setErrorMessage($fileTable->getErrorMessage());
            $this->dataView->printPage();
        } else {
            $this->dataView->setCode($result["code"]);
            $this->dataView->setErrorMessage($result["message"]);
            $this->dataView->printPage();
        }
    }

    private function command_deleteNeuralDataset() {
        $datasetID = 0;
        $param = $this->controller->param_deleteNeuralDataset($datasetID);

        if ($param) {
            $datasetTable = new \model\db\table\Dataset();
            $datasetTable->init();
            $datasetTable->setRequest([
                "datasetID" => $datasetID
            ]);

            $datasetTable->executeDeleteDatasetQuery();

            $this->dataView->setCode($datasetTable->getCode());
            $this->dataView->setErrorMessage($datasetTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getNeuralDatasets() {
        $tagID = 0;
        $fileID = 0;
        $param = $this->controller->param_getNeuralDatasets($tagID, $fileID);

        if ($param) {
            $datasetTable = new \model\db\table\NeuralDatasets();
            $datasetTable->init();
            $datasetTable->setRequest([
                "tagID" => $tagID,
                "fileID" => $fileID
            ]);

            $datasetTable->executeGetNeuralDatasetsQuery();

            $this->dataView->addData("datasets", $datasetTable->getResponse()["datasets"]);
            $this->dataView->setCode($datasetTable->getCode());
            $this->dataView->setErrorMessage($datasetTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_getNeuralInfo() {
        $tagID = 0;
        $fileID = 0;

        $param = $this->controller->param_getNeuralInfo($tagID, $fileID);

        if ($param) {
            $neuralinfoTable = new \model\db\table\NeuralInfo();
            $neuralinfoTable->init();
            $neuralinfoTable->setRequest([
                "tagID" => $tagID,
                "fileID" => $fileID
            ]);

            $neuralinfoTable->executeNeuralInfoQuery();

            $this->dataView->addData("neuralInfo", $neuralinfoTable->getResponse()["neuralInfo"]);
            $this->dataView->setCode($neuralinfoTable->getCode());
            $this->dataView->setErrorMessage($neuralinfoTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_analyzeFile() {
        $fileID = 0;
        $param = $this->controller->param_analyzeFile($fileID);

        if ($param) {
            $driveManager = new \model\drive\DriveManager();
            
            $resultFile = $driveManager->downloadFile($fileID);
            
            if ($resultFile == 0) {
                $file = $driveManager->getDownload();

                $mime = $file["mime"];
                $file64 = base64_encode($file["data"]);
                $userID = $this->context->getUserID();
                $data = "fileID=$fileID;mime=$mime;userID=$userID;";

                $requestArray = array(
                    "command" => 1,
                    "file64" => $file64,
                    "data" => $data);

                $socketManager = new \model\socket\SocketManager();
                $socketManager->initFromConfig();
                $socketManager->createSocket();
                if ($socketManager->isSocketAvailable()) {
                    //Mi connetto al server. Il server si disconnetterà appena inviata la risposta.
                    $socketManager->connectSocket();

                    if ($socketManager->isConnected()) {
                        //Scrivo la richiesta
                        $socketManager->setRequestArray($requestArray);
                        if ($socketManager->writeRequest()) {
                            //Leggo la risposta
                            if ($socketManager->readResponse()) {
                                $responseArray = $socketManager->getResponseArray();

                                $this->dataView->setCode($responseArray["code"] * 10);
                                $this->dataView->setErrorMessage($responseArray["message"]);
                                $this->dataView->printPage();
                            } else {
                                $this->errorView->printErrorCode("Impossibile leggere risposta socket", 1);
                            }
                        } else {
                            $this->errorView->printErrorCode("Impossibile scrivere richiesta socket", 2);
                        }
                    } else {
                        $this->errorView->printErrorCode("Impossibile connettersi al socket", 3);
                    }
                } else {
                    $this->errorView->printErrorCode("Impossibile attivare il socket", 4);
                }
            } else {
                $this->errorView->printErrorCode("File non trovato", 5);
            }
        }
    }

    private function command_addDataset() {
        $presetID = 0;
        $tagID = 0;
        $fileID = 0;
        $image64 = "";
        $points64 = "";

        $param = $this->controller->param_addDataset($presetID, $tagID, $fileID, $image64, $points64);

        if ($param) {
            //Per ora nessun filtro sugli inputz 64.
            $data = "tagID=$tagID;presetID=$presetID;fileID=$fileID;";
            $requestArray = array(
                "command" => 2,
                "data" => $data,
                "image64" => $image64,
                "points64" => $points64
            );

            $socketManager = new \model\socket\SocketManager();
            $socketManager->initFromConfig();
            $socketManager->createSocket();
            if ($socketManager->isSocketAvailable()) {
                //Mi connetto al server. Il server si disconnetterà appena inviata la risposta.
                $socketManager->connectSocket();

                if ($socketManager->isConnected()) {
                    //Scrivo la richiesta
                    $socketManager->setRequestArray($requestArray);
                    if ($socketManager->writeRequest()) {
                        //Leggo la risposta
                        if ($socketManager->readResponse()) {
                            $socketManager->closeSocket();
                            $responseArray = $socketManager->getResponseArray();

                            $this->dataView->setCode($responseArray["code"] * 10);
                            $this->dataView->setErrorMessage($responseArray["message"]);
                            $this->dataView->printPage();
                        } else {
                            $this->errorView->printErrorCode("Impossibile leggere risposta socket", 1);
                        }
                    } else {
                        $this->errorView->printErrorCode("Impossibile scrivere richiesta socket", 2);
                    }
                } else {
                    $this->errorView->printErrorCode("Impossibile connettersi al socket", 3);
                }
            } else {
                $this->errorView->printErrorCode("Impossibile attivare il socket", 4);
            }
        }
    }

    private function command_addFeedback($positive) {
        $seq = 0;
        $fileID = 0;

        $param = $this->controller->param_addFeedback($fileID, $seq);

        if ($param) {
            $driveManager = new \model\drive\DriveManager();
            $resultFile = $driveManager->downloadFile($fileID);
            if ($resultFile == 0) {
                $file = $driveManager->getDownload();

                $mime = $file["mime"];
                $file64 = base64_encode($file["data"]);
                $userID = $this->context->getUserID();

                $data = "seq=$seq;fileID=$fileID;positive=" . ($positive ? "true" : "false") . ";mime=$mime;userID=$userID;";
                $requestArray = array(
                    "command" => 3,
                    "data" => $data,
                    "file64" => $file64
                );

                $socketManager = new \model\socket\SocketManager();
                $socketManager->initFromConfig();
                $socketManager->createSocket();
                if ($socketManager->isSocketAvailable()) {
                    //Mi connetto al server. Il server si disconnetterà appena inviata la risposta.
                    $socketManager->connectSocket();

                    if ($socketManager->isConnected()) {
                        //Scrivo la richiesta
                        $socketManager->setRequestArray($requestArray);
                        if ($socketManager->writeRequest()) {
                            //Leggo la risposta
                            if ($socketManager->readResponse()) {
                                $responseArray = $socketManager->getResponseArray();

                                $this->dataView->setCode($responseArray["code"] * 10);
                                $this->dataView->setErrorMessage($responseArray["message"]);
                                $this->dataView->printPage();
                            } else {
                                $this->errorView->printErrorCode("Impossibile leggere risposta socket", 1);
                            }
                        } else {
                            $this->errorView->printErrorCode("Impossibile scrivere richiesta socket", 2);
                        }
                    } else {
                        $this->errorView->printErrorCode("Impossibile connettersi al socket", 3);
                    }
                } else {
                    $this->errorView->printErrorCode("Impossibile attivare il socket", 4);
                }
            } else {
                $this->errorView->printErrorCode("File non trovato", 5);
            }
        }
    }

    private function command_addPositiveFeedback() {
        $this->command_addFeedback(true);
    }

    private function command_addNegativeFeedback() {
        $this->command_addFeedback(false);
    }

    private function command_getPresets() {
        $presetTable = new \model\db\table\Preset();
        $presetTable->init();
        $presetTable->executeGetPresetsQuery();

        $this->dataView->addData("presets", $presetTable->getResponse()["presets"]);
        $this->dataView->setCode($presetTable->getCode());
        $this->dataView->setErrorMessage($presetTable->getErrorMessage());
        $this->dataView->printPage();
    }

    private function command_getSuggestedTags() {
        $fileID = 0;
        $param = $this->controller->param_getSuggestedTags($fileID);

        if ($param) {
            $suggestedtagsTable = new \model\db\table\SuggestedTags();
            $suggestedtagsTable->init();
            $suggestedtagsTable->setRequest([
                "fileID" => $fileID
            ]);

            $suggestedtagsTable->executeGetSuggestedTagsQuery();

            $this->dataView->addData("suggestedTags", $suggestedtagsTable->getResponse()["suggestedTags"]);
            $this->dataView->setCode($suggestedtagsTable->getCode());
            $this->dataView->setErrorMessage($suggestedtagsTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_delSuggestedTag() {
        $tagID = 0;
        $fileID = 0;
        $param = $this->controller->param_delSuggestedTag($tagID, $fileID);

        if ($param) {
            $riscontroNeuraleTable = new \model\db\table\RiscontroNeurale();
            $riscontroNeuraleTable->init();
            $riscontroNeuraleTable->setRequest([
                "tagID" => $tagID,
                "fileID" => $fileID
            ]);

            $riscontroNeuraleTable->executeDeleteRiscontroNeuraleQuery();

            $this->dataView->setCode($riscontroNeuraleTable->getCode());
            $this->dataView->setErrorMessage($riscontroNeuraleTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

    private function command_filteredLsFile() {
        $dirID = 0;
        $tagsID = array();
        $param = $this->controller->param_filteredLsFile($dirID, $tagsID);

        if ($param) {
            $lsFileTable = new \model\db\table\LsFile();
            $lsFileTable->init();
            $lsFileTable->setRequest([
                "dirID" => $dirID,
                "tagsID" => $tagsID
            ]);

            $lsFileTable->executeFilteredLsFileQuery();

            $this->dataView->addData("lsFile", $lsFileTable->getResponse()["lsFile"]);
            $this->dataView->setCode($lsFileTable->getCode());
            $this->dataView->setErrorMessage($lsFileTable->getErrorMessage());
            $this->dataView->printPage();
        }
    }

}
