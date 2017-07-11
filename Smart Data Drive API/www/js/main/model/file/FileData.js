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
class FileData {
    constructor() {
        this.lsFile = new Array();
        this.url = "php/ajax.php";
        this.dirID = 0;
        this.tagsID = new Array();
    }

    ajaxLsFile(onSuccess, onError) {
        var data = {command: "lsFile", dirID: this.dirID};

        var contextUpdate = {
            model: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0://success
                        this.model.lsFile = response.lsFile;
                        this.onSuccess(response);
                        break;
                    default://error
                        this.model.lsFile = new Array();
                        this.onError(response);
                        break;
                }

            },
            dataType: "json"
        });
    }

    ajaxFilteredLsFile(onSuccess, onError) {
        var data = {command: "filteredLsFile", dirID: this.dirID, tagsID: this.tagsID};

        var contextUpdate = {
            model: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0://success
                        this.model.lsFile = response.lsFile;
                        this.onSuccess(response);
                        break;
                    default://error
                        this.model.lsFile = new Array();
                        this.onError(response);
                        break;
                }

            },
            dataType: "json"
        });
    }

    setDirID(dirID) {
        this.dirID = dirID;
    }

    setTagsID(tagsID) {
        this.tagsID = tagsID;
    }

}
