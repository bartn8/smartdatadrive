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

session_start();

$dir = dirname(__FILE__);

include_once "config.php";


if (!$GLOBALS["debug"]) {
    error_reporting(0);
}else{
    ini_set('display_errors', 1);
}

if ($GLOBALS["enableAutoFlush"]) {
    ob_implicit_flush();
}

$ds = DIRECTORY_SEPARATOR;

include_once "$dir".$ds."thirdparty".$ds."gisconverter.php";
include_once "$dir".$ds."model".$ds."com".$ds."Context.php";
include_once "$dir".$ds."model".$ds."com".$ds."Hash.php";
include_once "$dir".$ds."model".$ds."db".$ds."DBInfo.php";
include_once "$dir".$ds."model".$ds."db".$ds."DBConnection.php";
include_once "$dir".$ds."model".$ds."db".$ds."Table.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."File.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."Dataset.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."Directory.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."FileTagLink.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."Preset.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."Tag.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."Utente.php";
include_once "$dir".$ds."model".$ds."db".$ds."tables".$ds."RiscontroNeurale.php";
include_once "$dir".$ds."model".$ds."db".$ds."views".$ds."FileInfo.php";
include_once "$dir".$ds."model".$ds."db".$ds."views".$ds."LsFile.php";
include_once "$dir".$ds."model".$ds."db".$ds."views".$ds."NeuralDatasets.php";
include_once "$dir".$ds."model".$ds."db".$ds."views".$ds."NeuralInfo.php";
include_once "$dir".$ds."model".$ds."db".$ds."views".$ds."SuggestedTags.php";
include_once "$dir".$ds."model".$ds."drive".$ds."DriveManager.php";
include_once "$dir".$ds."model".$ds."socket".$ds."SocketManager.php";
include_once "$dir".$ds."view".$ds."View.php";
include_once "$dir".$ds."view".$ds."ajax".$ds."JDataView.php";
include_once "$dir".$ds."view".$ds."ajax".$ds."JErrorView.php";
include_once "$dir".$ds."controller".$ds."ajax".$ds."AjaxController.php";
include_once "$dir".$ds."mvc".$ds."Ajax.php";


$ajax = new \mvc\Ajax();
$ajax->load();
$ajax->executeCommand();
