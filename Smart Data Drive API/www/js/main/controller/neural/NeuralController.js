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


class NeuralController extends Controller {

    constructor($interface, $neuralView) {
        super($interface);

        //Views
        this.neuralView = new NeuralView($neuralView);

        //Models
        this.neuralData = new NeuralData();

        //Context del controller
        this.context = {
            currentView: -1,
            fileID: 0,
            tag: new Object()//,
                    //neuralID: 0,
                    //datasetID: 0
        };

        //Context di callback
        this.neuralViewContext = new Object();

        //context di callback dell' interfaccia
        this.interfaceContext = new Object();
    }

    init() {
        //Ascolto delle views.
        this.neuralViewContext["neuralController"] = this;
        this.neuralViewContext["onButtonEditorClick"] = this.neuralView_onButtonEditorClick;
        this.neuralViewContext["onButtonTestClick"] = this.neuralView_onButtonTestClick;
        this.neuralViewContext["onButtonDatasetRemoveClick"] = this.neuralView_onButtonDatasetRemoveClick;

        this.neuralView.$this.on("NeuralView_buttonEditorClick", $.proxy(this.neuralViewContext.onButtonEditorClick, this.neuralViewContext));
        this.neuralView.$this.on("NeuralView_buttonTestClick", $.proxy(this.neuralViewContext.onButtonTestClick, this.neuralViewContext));
        this.neuralView.$this.on("NeuralView_buttonDatasetRemoveClick", $.proxy(this.neuralViewContext.onButtonDatasetRemoveClick, this.neuralViewContext));

        //Ascolto dell' interfaccia...
        this.interfaceContext["neuralController"] = this;
        this.interfaceContext["onFileTagClick"] = this.fileController_onFileTagClick;
        this.interfaceContext["onToggleView"] = this.fileController_onToggleView;

        this.on("FileController_toggleView", $.proxy(this.interfaceContext.onToggleView, this.interfaceContext));
        this.on("FileController_FileTagClick", $.proxy(this.interfaceContext.onFileTagClick, this.interfaceContext));
    }

    neuralView_onButtonEditorClick(e, fileMIME, datasetID) {
        var fileID = this.neuralController.context.fileID;
        var tagID = this.neuralController.context.tag.tagID;
        //var neuralID = this.neuralController.context.neuralID;
        //this.neuralController.context.datasetID = datasetID;
        this.neuralController.trigger("NeuralController_EditorClick", [fileMIME, fileID, tagID, datasetID]);
    }

    neuralView_onButtonTestClick(e, datasetID) {
        if (datasetID > 0) {
            var updateContext = {
                neuralController: this.neuralController,
                onSuccess: function (response) {
                    this.neuralController.viewNeuralView();
                },
                onError: function (response) {
                    this.neuralController.trigger("Interface_onLog", ["Errore", "Impossibile eliminare il dataset (" + response.code + ")"], 2);
                }
            };

            //this.neuralController.context.datasetID = datasetID;
            this.neuralController.neuralData.setDatasetID(datasetID);
            this.neuralController.neuralData.ajaxTestNeuralDataset($.proxy(updateContext.onSuccess, updateContext), $.proxy(updateContext.onError, updateContext));
        }
    }

    neuralView_onButtonDatasetRemoveClick(e, datasetID) {
        if (datasetID > 0) {
            var updateContext = {
                neuralController: this.neuralController,
                onSuccess: function (response) {
                    this.neuralController.viewNeuralView();
                },
                onError: function (response) {
                    this.neuralController.trigger("Interface_onLog", ["Errore", "Impossibile eliminare il dataset (" + response.code + ")"], 2);
                }
            };

            //this.neuralController.context.datasetID = datasetID;
            this.neuralController.neuralData.setDatasetID(datasetID);
            this.neuralController.neuralData.ajaxDeleteNeuralDataset($.proxy(updateContext.onSuccess, updateContext), $.proxy(updateContext.onError, updateContext));
        }
    }

    fileController_onFileTagClick(e, view, fileID, tag) {
        if (view === 1) {
            this.neuralController.context.fileID = parseInt(fileID);
            this.neuralController.context.tag = tag;
            this.neuralController.viewNeuralView();
        }
    }

    fileController_onToggleView(e, fileController, index) {
        switch (index) {
            case 3:
                this.neuralController.neuralView.disableView();
                break;
            default:
                this.neuralController.hideAll();
        }
    }

    toggleView(index) {
        switch (index) {
            case - 1:
            case 0:
                this.context.currentView = index;
                break;
            default:
        }
        switch (index) {
            case -1://Nulla
            {
                this.neuralView.hide();
                break;
            }
            case 0://NeuralView
            {
                this.neuralView.show();
                break;
            }
            default:
        }
    }

    viewNeuralView() {
        this.toggleView(0);

        var getNeuralInfoContext = {
            neuralController: this,
            onSuccess: function (response) {
                //this.neuralController.context.neuralID = this.neuralController.neuralData.neuralInfo.neuralNetworkID;
                this.neuralController.neuralView.setNeuralInfo(this.neuralController.neuralData.neuralInfo);
                this.neuralController.neuralView.updateView();
            },
            onError: function (response) {
                this.neuralController.trigger("Interface_onLog", ["Info", "Nessuna info neurale"], -1);
            }
        };

        this.neuralData.setFileID(parseInt(this.context.fileID));
        this.neuralData.setTagID(parseInt(this.context.tag.tagID));
        this.neuralData.ajaxGetNeuralInfo($.proxy(getNeuralInfoContext.onSuccess, getNeuralInfoContext), $.proxy(getNeuralInfoContext.onError, getNeuralInfoContext));

        var getNeuralDatasetsContext = {
            neuralController: this,
            onSuccess: function (response) {
                this.neuralController.neuralView.setDatasets(this.neuralController.neuralData.datasets);
                this.neuralController.neuralView.updateView();
            },
            onError: function (response) {
                this.neuralController.trigger("Interface_onLog", ["Info", "Nessun dataset"], -1);
            }
        };

        this.neuralData.setFileID(parseInt(this.context.fileID));
        this.neuralData.setTagID(parseInt(this.context.tag.tagID));
        this.neuralData.ajaxGetNeuralDatasets($.proxy(getNeuralDatasetsContext.onSuccess, getNeuralDatasetsContext), $.proxy(getNeuralDatasetsContext.onError, getNeuralDatasetsContext));
    }

    hideAll() {
        this.toggleView(-1);
    }

}