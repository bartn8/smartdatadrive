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

class TreeData {
    constructor() {
        this.url = "php/ajax.php";
        this.lsDir = new Array();
        this.mainDir = {};
    }

    ajaxMkDir(name, onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "mkDir", dirIDParent: this.mainDir.dirID, dirName: name},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxLsDir(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "lsDir", dirID: this.mainDir.dirID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.lsDir = response.lsDir;
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxGetUpperDir(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getUpperDir", dirID: this.mainDir.dirID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.mainDir = response.upperDir;
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxGetRoot(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getRoot"},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.mainDir = response.rootDir;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.mainDir = new Object();
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    setMainDir(mainDir) {
        this.mainDir = mainDir;
    }

}