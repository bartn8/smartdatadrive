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

class BootboxSelectPresetDynamicView extends View {
    constructor($this) {
        super($this);
        this.presets = new Array();
        this.presetID = 0;
    }

    updateView() {
        var $bootboxLabelPresetDesc = this.$this.find(".bootboxLabelPresetDesc");
        var $bootboxLabelPresetMIME = this.$this.find(".bootboxLabelPresetMIME");
        var $bootboxLabelPresetNeuralType = this.$this.find(".bootboxLabelPresetNeuralType");
        var $bootboxLabelPresetNeuralTransferFunction = this.$this.find(".bootboxLabelPresetNeuralTransferFunction");
        var $bootboxLabelPresetNeuralHiddenLayers = this.$this.find(".bootboxLabelPresetNeuralHiddenLayers");
        var $bootboxLabelPresetNeuralArea = this.$this.find(".bootboxLabelPresetNeuralArea");
        var $bootboxLabelPresetNeuralColorMode = this.$this.find(".bootboxLabelPresetNeuralColorMode");
        var $bootboxLabelPresetNeuralPlugins = this.$this.find(".bootboxLabelPresetNeuralPlugins");
        var $bootboxLabelPresetNeuralLearningRule = this.$this.find(".bootboxLabelPresetNeuralLearningRule");
        var $bootboxLabelPresetNeuralLearningRate = this.$this.find(".bootboxLabelPresetNeuralLearningRate");
        var $bootboxLabelPresetNeuralMaxErrorFunction = this.$this.find(".bootboxLabelPresetNeuralMaxErrorFunction");
        var $bootboxLabelPresetNeuralMaxError = this.$this.find(".bootboxLabelPresetNeuralMaxError");


        for (var i = 0; i < this.presets.length; i++) {
            var preset = this.presets[i];

            if (preset["presetID"] === this.presetID) {
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
                return;
            }
        }
    }

    setPresets(presets) {
        this.presets = presets;
    }

    setPresetID(presetID) {
        this.presetID = presetID;
    }
}