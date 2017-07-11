<?php

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

namespace model\db\table;

/**
 * Description of Preset
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class Preset extends Table {

    public function __construct() {
        parent::__construct();
    }

    public function executeGetPresetsQuery() {
        if ($this->dbConn->connect()) {
            $stmt = $this->dbConn->prepare("SELECT id, nome, descrizione, mime, tipo_rete_neurale, learning_rule, learning_rate, max_error, max_error_function, transfer_function, hidden_layers, width, height, color_mode, plugins "
                    . "FROM preset");

            $stmt->execute();

            $out_presetID = 0;
            $out_presetName = "";
            $out_presetDescrizione = "";
            $out_presetFileMIME = "";
            $out_presetNeuralType = "";
            $out_presetNeuralLearningRule = "";
            $out_presetNeuralLearningRate = 0.0;
            $out_presetNeuralMaxError = 0.0;
            $out_presetNeuralMaxErrorFunction = "";
            $out_presetNeuralTransferFunction = "";
            $out_presetNeuralHiddenlayers = "";
            $out_presetNeuralWidth = 0;
            $out_presetNeuralHeight = 0;
            $out_presetNeuralColorMode = "";
            $out_presetNeuralPlugins = "";

            $stmt->bind_result($out_presetID, $out_presetName, $out_presetDescrizione, $out_presetFileMIME, $out_presetNeuralType, $out_presetNeuralLearningRule, $out_presetNeuralLearningRate, $out_presetNeuralMaxError, $out_presetNeuralMaxErrorFunction, $out_presetNeuralTransferFunction, $out_presetNeuralHiddenlayers, $out_presetNeuralWidth, $out_presetNeuralHeight, $out_presetNeuralColorMode, $out_presetNeuralPlugins);

            $this->response["presets"] = array();
            $rows = 0;
            
            for ($i = 0; $stmt->fetch(); $i++) {
                $rows++;
                $this->response["presets"][$i] = array();
                $this->response["presets"][$i]["presetID"] = $out_presetID;
                $this->response["presets"][$i]["name"] = $out_presetName;
                $this->response["presets"][$i]["desc"] = $out_presetDescrizione;
                $this->response["presets"][$i]["fileMIME"] = $out_presetFileMIME;
                $this->response["presets"][$i]["neuralType"] = $out_presetNeuralType;
                $this->response["presets"][$i]["neuralLearningRule"] = $out_presetNeuralLearningRule;
                $this->response["presets"][$i]["neuralLearningRate"] = $out_presetNeuralLearningRate;
                $this->response["presets"][$i]["neuralMaxError"] = $out_presetNeuralMaxError;
                $this->response["presets"][$i]["neuralMaxErrorFunction"] = $out_presetNeuralMaxErrorFunction;
                $this->response["presets"][$i]["neuralTransferFunction"] = $out_presetNeuralTransferFunction;
                $this->response["presets"][$i]["neuralHiddenLayers"] = $out_presetNeuralHiddenlayers;
                $this->response["presets"][$i]["neuralWidth"] = $out_presetNeuralWidth;
                $this->response["presets"][$i]["neuralHeight"] = $out_presetNeuralHeight;
                $this->response["presets"][$i]["neuralColorMode"] = $out_presetNeuralColorMode;
                $this->response["presets"][$i]["neuralPlugins"] = $out_presetNeuralPlugins;
            }

            if ($rows > 0) {
                $this->code = 0;
                $this->response["return"] = true;
            } else {
                $this->code = 2;
                $this->errorMessage = "Nessun preset trovato";
            }

            $stmt->close();
            $this->dbConn->close();
        } else {
            $this->code = 1;
            $this->errorMessage = "Errore nella connessione al server: " . $this->dbConn->getConnectionError();
        }
    }

}
