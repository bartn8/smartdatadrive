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

class BootboxSelectPresetDialog {
    constructor() {
        this.$container = $("<div></div>");
        this.presets = new Array();
        this.init();
    }

    init() {
        //this.$container.append("<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Scegli il preset</label><select class=\"form-control bootboxPresetIDSelect\"></select></div></div></div><div class=\"row\"><div class=\"col-md-12\"></div></div></div>");
        this.$container.append("<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Scegli il preset</label><select class=\"form-control bootboxPresetIDSelect\"></select></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Descrizione Preset</label><p class=\"form-control bootboxLabelPresetDesc\"></p></div><div class=\"form-group\"><label>Preset per file</label><p class=\"form-control bootboxLabelPresetMIME\"></p></div><div class=\"form-group\"><label>Tipo rete neurale</label><p class=\"form-control bootboxLabelPresetNeuralType\"></p></div><div class=\"form-group\"><label>Funzione di trasferimento</label><p class=\"form-control bootboxLabelPresetNeuralTransferFunction\"></p></div><div class=\"form-group\"><label>Livelli nascosti</label><p class=\"form-control bootboxLabelPresetNeuralHiddenLayers\"></p></div><div class=\"form-group\"><label>Area di apprendimento</label><p class=\"form-control bootboxLabelPresetNeuralArea\"></p></div><div class=\"form-group\"><label>Modalità colore</label><p class=\"form-control bootboxLabelPresetNeuralColorMode\"></p></div><div class=\"form-group\"><label>Plugins rete neurale</label><p class=\"form-control bootboxLabelPresetNeuralPlugins\"></p></div><div class=\"form-group\"><label>Tipo apprendimento</label><p class=\"form-control bootboxLabelPresetNeuralLearningRule\"></p></div><div class=\"form-group\"><label>Valore di apprendimento</label><p class=\"form-control bootboxLabelPresetNeuralLearningRate\"></p></div><div class=\"form-group\"><label>Funzione di errore</label><p class=\"form-control bootboxLabelPresetNeuralMaxErrorFunction\"></p></div><div class=\"form-group\"><label>Valore massimo di errore</label><p class=\"form-control bootboxLabelPresetNeuralMaxError\"></p></div></div></div></div>");
    }

    updateDialog() {
        var $select = this.$container.find(".bootboxPresetIDSelect");
        $select.empty();

        for (var i = 0; i < this.presets.length; i++) {
            var $option = $("<option></option>");
            $option.attr("value", this.presets[i].presetID);
            $option.text(this.presets[i].name);
            $select.append($option);
        }

        if (this.presets.length > 0) {
            var $bootboxLabelPresetDesc = this.$container.find(".bootboxLabelPresetDesc");
            var $bootboxLabelPresetMIME = this.$container.find(".bootboxLabelPresetMIME");
            var $bootboxLabelPresetNeuralType = this.$container.find(".bootboxLabelPresetNeuralType");
            var $bootboxLabelPresetNeuralTransferFunction = this.$container.find(".bootboxLabelPresetNeuralTransferFunction");
            var $bootboxLabelPresetNeuralHiddenLayers = this.$container.find(".bootboxLabelPresetNeuralHiddenLayers");
            var $bootboxLabelPresetNeuralArea = this.$container.find(".bootboxLabelPresetNeuralArea");
            var $bootboxLabelPresetNeuralColorMode = this.$container.find(".bootboxLabelPresetNeuralColorMode");
            var $bootboxLabelPresetNeuralPlugins = this.$container.find(".bootboxLabelPresetNeuralPlugins");
            var $bootboxLabelPresetNeuralLearningRule = this.$container.find(".bootboxLabelPresetNeuralLearningRule");
            var $bootboxLabelPresetNeuralLearningRate = this.$container.find(".bootboxLabelPresetNeuralLearningRate");
            var $bootboxLabelPresetNeuralMaxErrorFunction = this.$container.find(".bootboxLabelPresetNeuralMaxErrorFunction");
            var $bootboxLabelPresetNeuralMaxError = this.$container.find(".bootboxLabelPresetNeuralMaxError");



            var preset = this.presets[0];

            $bootboxLabelPresetDesc.text(preset["desc"]);
            $bootboxLabelPresetMIME.text(preset["fileMIME"]);
            $bootboxLabelPresetNeuralType.text(preset["neuralType"]);
            $bootboxLabelPresetNeuralTransferFunction.text(preset["neuralTransferFunction"]);
            $bootboxLabelPresetNeuralHiddenLayers.text(preset["neuralHiddenLayers"]);
            $bootboxLabelPresetNeuralArea.text(preset["neuralWidth"] + "x" + preset["neuralHeight"]);
            $bootboxLabelPresetNeuralColorMode.text(preset["neuralColorMode"]);
            $bootboxLabelPresetNeuralPlugins.text(preset["neuralPlugins"]);
            $bootboxLabelPresetNeuralLearningRule.text(preset["neuralLearningRule"]);
            $bootboxLabelPresetNeuralLearningRate.text(preset["neuralLearningRate"]);
            $bootboxLabelPresetNeuralMaxErrorFunction.text(preset["neuralMaxErrorFunction"]);
            $bootboxLabelPresetNeuralMaxError.text(preset["neuralMaxError"]);
        }
    }

    setPresets(presets) {
        this.presets = presets;
    }

    get toHTML() {
        return this.$container.html();
    }

    get loadingHTML() {
        return "<div class=\"media\"><div class=\"media-left\"><div class=\"loader\"></div></div><div class=\"media-body\"><h4 class=\"media-heading\">Caricamento...</h4><p>Ricerca di tag disponibili...</p></div></div>";
    }
}