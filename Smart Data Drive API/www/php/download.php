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
} else{
    ini_set('display_errors', 1);
}

$ds = DIRECTORY_SEPARATOR;

include_once "$dir".$ds."model".$ds."com".$ds."Context.php";
include_once "$dir".$ds."model".$ds."db".$ds."DBInfo.php";
include_once "$dir".$ds."model".$ds."db".$ds."DBConnection.php";
include_once "$dir".$ds."model".$ds."db".$ds."Table.php";
include_once "$dir".$ds."model".$ds."db".$ds."views".$ds."FileInfo.php";
include_once "$dir".$ds."model".$ds."drive".$ds."DriveManager.php";
include_once "$dir".$ds."view".$ds."View.php";
include_once "$dir".$ds."view".$ds."com".$ds."HErrorView.php";
include_once "$dir".$ds."view".$ds."download".$ds."DownloadView.php";
include_once "$dir".$ds."controller".$ds."download".$ds."DownloadController.php";
include_once "$dir".$ds."mvc".$ds."Download.php";

$controller = new mvc\Download();
$controller->load();
$controller->executeCommand();