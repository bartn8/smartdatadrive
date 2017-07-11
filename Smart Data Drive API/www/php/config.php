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

$debug = true;
$rootDir = $_SERVER['DOCUMENT_ROOT'];
//UPLOAD
$drivesDir = $rootDir . "/drives/";
$maxUploadFileSize = 32 * 1024 * 1024;
//DOWNLOAD
$downloadCache = 8 * 1024 * 1024;
//SOCKET
$ipAddress = "localhost";
$servicePort = 30001;
$enableAutoFlush = true;
//MYSQL
$mysqlServerURL="localhost";
$mysqlUsername="root";
$mysqlPassword="";
$mysqlDbName="smart_data_drive";
//HASH
$defaultHashAlgorithm = "sha256";