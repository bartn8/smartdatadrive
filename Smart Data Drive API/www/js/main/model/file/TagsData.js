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


class TagsData {

    constructor() {
        this.tags = new Array();
        this.url = "php/ajax.php";
        this.fileID = 0;
        this.dirID = 0;
    }

    ajaxCreateTag(tagName, tagDesc, tagShareable, tagParentID, onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {
                command: "createTag",
                tagName: tagName,
                tagDesc: tagDesc,
                isTagShareable: tagShareable,
                tagIDParent: tagParentID
            },
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.tags = [response.tag];
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.setDefaultVar();
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxAddFileTagLink(tagID, fileID, onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {
                command: "addFileTagLink",
                tagID: tagID,
                fileID: fileID
            },
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

    ajaxRemoveFileTagLink(tagID, fileID, onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {
                command: "removeFileTagLink",
                tagID: tagID,
                fileID: fileID
            },
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

    ajaxGetFileTags(onSuccess, onError) {//file
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getFileTags", fileID: this.fileID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.tags = response.tags;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.setDefaultVar();
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxGetDirTags(onSuccess, onError) {//Directory
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getDirTags", dirID: this.dirID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.tags = response.tags;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.setDefaultVar();
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxGetTags(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getTags"},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.tags = response.tags;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.setDefaultVar();
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    setFileID(fileID) {
        this.fileID = fileID;
    }

    setDirID(dirID) {
        this.dirID = dirID;
    }

    setDefaultVar() {
        this.tags = new Array();
        this.fileID = 0;
        this.dirID = 0;
    }
}