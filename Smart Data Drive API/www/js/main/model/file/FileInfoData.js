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
class FileInfoData {
    constructor() {
        this.fileInfo = {};
        this.url = "php/ajax.php";
        this.data = {command: "fileInfo", fileID: 0};
    }

    ajaxFileInfo(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: this.data,
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.fileInfo = response.fileInfo;
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
    
    

    setFileID(fileID) {
        this.data.fileID = fileID;
    }

}
