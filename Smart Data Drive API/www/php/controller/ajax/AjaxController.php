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

class AjaxController {

    public function __construct() {
        
    }

    //-------------------------PARAMETRI----------------------------------------

    public function param_command(&$command) {
        $command = filter_input(INPUT_POST, "command");
        return true;
    }

    public function param_login(&$username, &$password) {
        $username = filter_input(INPUT_POST, "username");
        $password = filter_input(INPUT_POST, "password");
        return true;
    }

    public function param_registration(&$nome, &$cognome, &$nickname, &$email, &$username, &$password, &$driveNome) {
        $nome = filter_input(INPUT_POST, "nome", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $cognome = filter_input(INPUT_POST, "cognome", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $nickname = filter_input(INPUT_POST, "nickname", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
        $username = filter_input(INPUT_POST, "username");
        $password = filter_input(INPUT_POST, "password");
        $driveNome = filter_input(INPUT_POST, "driveNome", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        return true;
    }

    public function param_addFileTagLink(&$tagID, &$fileID) {
        $tagID = filter_input(INPUT_POST, "tagID", FILTER_SANITIZE_NUMBER_INT);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_removeFileTagLink(&$tagID, &$fileID) {
        $tagID = filter_input(INPUT_POST, "tagID", FILTER_SANITIZE_NUMBER_INT);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_createTag(&$tagName, &$tagDesc, &$isTagShareable, &$tagIDParent) {
        $tagName = filter_input(INPUT_POST, "tagName", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tagDesc = filter_input(INPUT_POST, "tagDesc", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $isTagShareable = filter_input(INPUT_POST, "isTagShareable", FILTER_VALIDATE_BOOLEAN);
        $tagIDParent = filter_input(INPUT_POST, "tagIDParent", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_getFileTags(&$fileID) {
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_getDirTags(&$dirID) {
        $dirID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_changeInfoFile(&$fileInfo64, &$fileID) {
        $fileInfo64 = filter_input(INPUT_POST, "fileInfo64", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_renameFile(&$newFileName, &$fileID) {
        $newFileName = filter_input(INPUT_POST, "newFileName", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_deleteFile(&$fileID) {
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_cutFiles(&$filesID, &$destDirID) {
        $filesID = filter_input(INPUT_POST, "filesID", FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        $destDirID = filter_input(INPUT_POST, "destDirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_copyFiles(&$filesID, &$destDirID) {
        $filesID = filter_input(INPUT_POST, "filesID", FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        $destDirID = filter_input(INPUT_POST, "destDirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_deleteFiles(&$filesID) {
        $filesID = filter_input(INPUT_POST, "filesID", FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        return true;
    }

    public function param_lsFile(&$dirID) {
        $dirID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_FileInfo(&$fileID) {
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_lsDir(&$dirID) {
        $dirID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_uploadFile(&$dirID, &$fileTmp, &$fileName, &$fileType, &$fileMIME, &$fileHash, &$fileThumbnail, &$result) {
        $result = array();
        $result["boolean"] = false;

        $dirID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        $fileThumbnail = filter_input(INPUT_POST, "thumbnail");

        if (!empty($_FILES)) {
            //Verifiche di sicurezza
            if (isset($_FILES['file']['error']) && !is_array($_FILES['file']['error'])) {

                switch ($_FILES['file']['error']) {
                    case UPLOAD_ERR_OK: {
                            if ($_FILES['file']['size'] <= $GLOBALS["maxUploadFileSize"]) {
                                $finfo = new \finfo(FILEINFO_MIME_TYPE);

                                $fileTmp = $_FILES['file']['tmp_name'];
                                $fileMIME = $finfo->file($fileTmp);
                                $fileHash = hash_file($GLOBALS["defaultHashAlgorithm"], $fileTmp);

                                $arrayFileInfoTmp = explode(".", $_FILES['file']['name']);

                                if (count($arrayFileInfoTmp) == 2) {
                                    $fileName = $arrayFileInfoTmp[0];
                                    $fileType = $arrayFileInfoTmp[1];
                                    $result["boolean"] = true;
                                } else {
                                    $result["code"] = 4 * 111;
                                    $result["message"] = "nome del file non consentito";
                                }
                            } else {
                                $result["code"] = 1 * 111;
                                $result["message"] = "dimensione file non consentita";
                            }
                            break;
                        }
                    case UPLOAD_ERR_NO_FILE:
                        $result["code"] = 2 * 111;
                        $result["message"] = "file non presente";
                        break;
                    case UPLOAD_ERR_INI_SIZE:
                    case UPLOAD_ERR_FORM_SIZE:
                        $result["code"] = 1 * 111;
                        $result["message"] = "dimensione file non consentita";
                        break;
                    default:
                        $result["code"] = 5 * 111;
                        $result["message"] = "errore upload sconosciuto";
                        break;
                }
            } else {
                $result["code"] = 3 * 111;
                $result["message"] = "parametri non validi";
            }
        } else {
            $result["code"] = 2 * 111;
            $result["message"] = "file non presente";
        }

        return $result["boolean"];
    }

    public function param_mkDir(&$dirIDParent, &$dirName) {
        $dirIDParent = filter_input(INPUT_POST, "dirIDParent", FILTER_SANITIZE_NUMBER_INT);
        $dirName = filter_input(INPUT_POST, "dirName", FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        return true;
    }

    public function param_getUpperDir(&$dirID) {
        $dirID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_deleteNeuralDataset(&$datasetID) {
        $datasetID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_getNeuralDatasets(&$tagID, &$fileID) {
        $tagID = filter_input(INPUT_POST, "tagID", FILTER_SANITIZE_NUMBER_INT);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_getNeuralInfo(&$tagID, &$fileID) {
        $tagID = filter_input(INPUT_POST, "tagID", FILTER_SANITIZE_NUMBER_INT);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_analyzeFile(&$fileID) {
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_addDataset(&$presetID, &$tagID, &$fileID, &$image64, &$points64) {
        $presetID = filter_input(INPUT_POST, "presetID", FILTER_SANITIZE_NUMBER_INT);
        $tagID = filter_input(INPUT_POST, "tagID", FILTER_SANITIZE_NUMBER_INT);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        $image64 = filter_input(INPUT_POST, "image64");
        $points64 = filter_input(INPUT_POST, "points64");
        return true;
    }

    public function param_addFeedback(&$fileID, &$seq) {
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        $seq = filter_input(INPUT_POST, "seq", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_getSuggestedTags(&$fileID) {
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_delSuggestedTag(&$tagID, &$fileID) {
        $tagID = filter_input(INPUT_POST, "tagID", FILTER_SANITIZE_NUMBER_INT);
        $fileID = filter_input(INPUT_POST, "fileID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

    public function param_filteredLsFile(&$dirID, &$tagsID) {
        $tagsID = filter_input(INPUT_POST, "tagsID", FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        if (!is_array($tagsID)) {
            $tagsID = array();
        }
        $dirID = filter_input(INPUT_POST, "dirID", FILTER_SANITIZE_NUMBER_INT);
        return true;
    }

}
