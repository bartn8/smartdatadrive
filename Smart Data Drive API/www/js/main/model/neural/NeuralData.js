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


class NeuralData {
    constructor() {
        this.url = "php/ajax.php";
        this.fileID = 0;
        this.tagID = 0;
        //this.neuralID = 0;
        this.datasetID = 0;
        this.neuralInfo = new Object();
        this.datasets = new Array();
    }

    ajaxGetNeuralInfo(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getNeuralInfo", tagID: this.tagID, fileID: this.fileID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.neuralInfo = response.neuralInfo;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.neuralInfo = new Object();
                        this.onError(response);
                        break;
                }

            },
            dataType: "json"
        });
    }
    
    ajaxTestNeuralDataset(onSuccess, onError){
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "testNeuralDataset", datasetID: this.datasetID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.datasets = response.datasets;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.datasets = new Array();
                        this.onError(response);
                        break;
                }

            },
            dataType: "json"
        });
    }

    ajaxGetNeuralDatasets(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "getNeuralDatasets", tagID: this.tagID, fileID: this.fileID},
            context: contextUpdate,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.datasets = response.datasets;
                        this.onSuccess(response);
                        break;
                    default:
                        this.context.datasets = new Array();
                        this.onError(response);
                        break;
                }

            },
            dataType: "json"
        });
    }

    ajaxDeleteNeuralDataset(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {command: "deleteNeuralDataset", datasetID: this.datasetID},
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

    setFileID(fileID) {
        this.fileID = fileID;
    }

    setTagID(tagID) {
        this.tagID = tagID;
    }

//    setNeuralID(neuralID) {
//        this.neuralID = neuralID;
//    }
    
    setDatasetID(datasetID){
        this.datasetID = datasetID;
    }
}