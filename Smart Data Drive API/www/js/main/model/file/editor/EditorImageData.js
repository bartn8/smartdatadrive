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

class EditorImageData {
    constructor() {
        this.url = "php/ajax.php";
        this.presets = new Array();
        this.image64 = "";
        this.imageMime = "";
        this.points = new Array();
        this.presetID = 0;
        this.datasetID = 0;
        this.tagID = 0;
        this.fileID = 0;
    }

    ajaxCreateDataset(onSuccess, onError) {
        var contextUpdate = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: {
                command: "addDataset",
                presetID: this.presetID,
                tagID: this.tagID,
                fileID: this.fileID,
                image64: this.image64,
                points64: this.compressPoints()
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

    ajaxGetPresets(onSuccess, onError) {
        var data = {command: "getPresets"};

        var context = {
            model: this,
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
                    case 0://success
                        this.model.presets = response.presets;
                        this.onSuccess(response);
                        break;
                    default://error
                        this.model.presets = new Array();
                        this.onError(response);
                        break;
                }

            },
            dataType: "json"
        });
    }

    setImage(image64) {
        this.image64 = image64;
    }

    setPoints(points, scale) {
        this.points = new Array();

        var min = points[0];

        //Ricerca punto minimo
        for (var i = 0; i < points.length; i++) {
            if (min.x > points[i].x) {
                min.x = points[i].x;
            }
            if (min.y > points[i].y) {
                min.y = points[i].y;
            }
        }

        //Applico offset e scaling
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            this.points.push({
                x: Math.round(((point.x - min.x) / scale) * 10) / 10,
                y: Math.round(((point.y - min.y) / scale) * 10) / 10,
                dm: point.dm
            });
        }

        //Rimozione punti uguali.
        this.points.sort(function (a, b) {
            return a - b;
        });
        
        for (var i = 0; i < this.points.length - 1;) {
            var xCond = this.points[i].x == this.points[i + 1].x;
            var yCond = this.points[i].y == this.points[i + 1].y;
            
            if (xCond && yCond) {
               this.points.shift();
            }else{
                i++;
            }
        }
    }
    
    compressPoints(){
        var JSONPoints = JSON.stringify(this.points);
        var points64 = window.btoa(JSONPoints);
        return points64;
    }

    setPresetID(presetID) {
        this.presetID = presetID;
    }

    setTagID(tagID) {
        this.tagID = tagID;
    }

    setDatasetID(datasetID) {
        this.datasetID = datasetID;
    }
    
    setFileID(fileID){
        this.fileID = fileID;
    }

}