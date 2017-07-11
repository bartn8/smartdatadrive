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

class NeuralView extends View {
    constructor($this) {
        super($this);
        this.neuralInfo = {};
        this.datasets = new Array();
    }

    updateView() {
        //Pulizia div.
        this.$this.empty();

        var $row = $("<div class=\"row\"><div class=\"col-md-12\"><h5>Nome Tag: <span class=\"label label-default neuralTagName\"></span></h5><h5>Descrizione</h5><div class=\"well-sm neuralTagDesc\"></div><h5>Condivisibile: <span class=\"label label-default neuralTagSharing\"></span></h5><h5>Autore: <span class=\"label label-default neuralTagAuthor\"></span></h5><h5>Data Creazione <span class=\"label label-default neuralTagCreationDate\"></span></h5><div class=\"showParentTag\"><h5>Nome Tag Padre: <span class=\"label label-default neuralTagParentName\"></span></h5></div></div></div><div class=\"row\"><div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Datasets:</label><select></select></div><div class=\"btn-group\"><button class=\"btn btn-primary btn-sm neuralEditorButton\">Addestra</button><button class=\"btn btn-primary btn-sm neuralTestButton\">Test</button><button class=\"btn btn-primary btn-sm neuralDatasetRemoveButton\">Rimuovi dataset</button></div></div></div></div></div><div class=\"row\"><div class=\"col-md-12\"><h5>Riscontro(%): <span class=\"label label-default neuralMatch\"></span></h5><h5>Data analisi: <span class=\"label label-default neuralMatchDate\"></span></h5></div></div>");

        var $tagName = $row.find(".neuralTagName");
        var $tagDesc = $row.find(".neuralTagDesc");
        var $tagCondivisibile = $row.find(".neuralTagSharing");
        var $neuralTagAuthor = $row.find(".neuralTagAuthor");
        var $neuralTagCreationDate = $row.find(".neuralTagCreationDate");
        var $showParentTag = $row.find(".showParentTag");
        var $tagParentName = $row.find(".neuralTagParentName");
        var $editorButton = $row.find(".neuralEditorButton");
        var $neuralTestButton = $row.find(".neuralTestButton");
        var $select = $row.find("select");
        var $datasetRemoveButton = $row.find(".neuralDatasetRemoveButton");
        var $match = $row.find(".neuralMatch");
        var $neuralMatchDate = $row.find(".neuralMatchDate");
        //var $matchValido = $row.find(".neuralMatchValid");


        $tagName.text(this.neuralInfo.tagName);
        if (this.neuralInfo.tagDescription != null) {
            $tagDesc.text(window.atob(this.neuralInfo.tagDescription));
        } else {
            $tagDesc.text("");
        }
        $tagCondivisibile.text(this.neuralInfo.isTagShareable ? "SI" : "NO");
        $neuralTagAuthor.text(this.neuralInfo.tagAuthorNickname);
        $neuralTagCreationDate.text(this.neuralInfo.tagCreationDate);
        $tagParentName.text(this.neuralInfo.tagParentName);
        $match.text(this.neuralInfo.matchTagFile);
        $neuralMatchDate.text(this.neuralInfo.matchTagFileDate);
        //$matchValido.text(this.neuralInfo.isMatchTagFileValid);

        if (this.neuralInfo.tagParentName == null) {
            $showParentTag.hide();
        }

        //Aggiungo l' opzione Nuovo dataset!
        var $option = $("<option></option>");
        $option.attr("value", -1);
        $option.text("[Nuovo Dataset]");
        $select.append($option);

        for (var i = 0; i < this.datasets.length; i++) {
            var $option = $("<option></option>");
            $option.attr("value", this.datasets[i].datasetID);
            $option.text("[ME: " + Math.round(this.datasets[i].maxError * 10000) / 10000 + " MME:" + Math.round(this.datasets[i].networkMaxError * 10000) / 10000 + "]");
            $select.append($option);
        }

        var buttonEditorContext = {
            context: this,
            $select: $select,
            linkMIME: this.neuralInfo.fileMIME,
            click: function (e) {
                var datasetID = this.$select.find("option:selected").attr("value");
                this.context.$this.trigger("NeuralView_buttonEditorClick", [this.linkMIME, datasetID]);
            }
        };

        $editorButton.click($.proxy(buttonEditorContext.click, buttonEditorContext));

        var buttonDatasetRemoveContext = {
            context: this,
            $select: $select,
            click: function (e) {
                var datasetID = this.$select.find("option:selected").attr("value");
                this.context.$this.trigger("NeuralView_buttonDatasetRemoveClick", [datasetID]);
            }
        };

        $datasetRemoveButton.click($.proxy(buttonDatasetRemoveContext.click, buttonDatasetRemoveContext));


        var buttonTestContext = {
            context: this,
            $select: $select,
            click: function (e) {
                var datasetID = this.$select.find("option:selected").attr("value");
                this.context.$this.trigger("NeuralView_buttonTestClick", [datasetID]);
            }
        };

        $neuralTestButton.click($.proxy(buttonTestContext.click, buttonTestContext));

        //Funzioni disabilitate
        $neuralTestButton.addClass("disabled");
        $datasetRemoveButton.addClass("disabled");


        this.$this.append($row);
    }

    enableView() {
        var $editorButton = this.$this.find(".neuralEditorButton");
        var $datasetRemoveButton = this.$this.find(".neuralDatasetRemoveButton");
        var $neuralTestButton = this.$this.find(".neuralTestButton");


        $editorButton.removeClass("disabled");

        //Funzioni disabilitate
        //$neuralTestButton.removeClass("disabled");
        //$datasetRemoveButton.removeClass("disabled");
    }

    disableView() {
        var $editorButton = this.$this.find(".neuralEditorButton");
        var $datasetRemoveButton = this.$this.find(".neuralDatasetRemoveButton");
        var $neuralTestButton = this.$this.find(".neuralTestButton");

        $neuralTestButton.addClass("disabled");
        $editorButton.addClass("disabled");
        $datasetRemoveButton.addClass("disabled");
    }

    setNeuralInfo(info) {
        this.neuralInfo = info;
    }

    setDatasets(datasets) {
        this.datasets = datasets;
    }

}