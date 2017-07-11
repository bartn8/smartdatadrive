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


class FileOptionsData {

    constructor() {
        this.url = "php/ajax.php";
    }

    rename(newName, fileHash, onSuccess, onError) {
        var data = {
            command: "renameFile",
            newFileName: newName,
            fileID: fileHash
        };

        var contextRename = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: contextRename,
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

    delete(fileHash, onSuccess, onError) {
        var data = {
            command: "deleteFile",
            fileID: fileHash
        };

        var contextDelete = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: contextDelete,
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

    ajaxChangeInfo(fileInfo64, fileID, onSuccess, onError) {
        var data = {
            command: "changeInfoFile",
            fileID: fileID,
            fileInfo64: fileInfo64
        };

        var context = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: context,
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

    ajaxAnalyzeFile(fileID, onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "analyzeFile", fileID: fileID},
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

}