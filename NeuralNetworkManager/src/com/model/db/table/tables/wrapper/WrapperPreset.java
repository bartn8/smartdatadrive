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
package com.model.db.table.tables.wrapper;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class WrapperPreset {

    private int ID;
    private String nome;
    private String descrizione;
    private String mime;
    private String tipoReteNeurale;
    private String learningRule;
    private double learningRate;
    private double maxError;
    private String maxErrorFunction;
    private String transferFunction;
    private String hiddenLayers;
    private int width;
    private int height;
    private String colorMode;
    private String plugins;

    public WrapperPreset(int ID, String nome, String descrizione, String mime, String tipoReteNeurale, String learningRule, double learningRate, double maxError, String maxErrorFunction, String transferFunction, String hiddenLayers, int width, int height, String colorMode, String plugins) {
        this.ID = ID;
        this.nome = nome;
        this.descrizione = descrizione;
        this.mime = mime;
        this.tipoReteNeurale = tipoReteNeurale;
        this.learningRule = learningRule;
        this.learningRate = learningRate;
        this.maxError = maxError;
        this.maxErrorFunction = maxErrorFunction;
        this.transferFunction = transferFunction;
        this.hiddenLayers = hiddenLayers;
        this.width = width;
        this.height = height;
        this.colorMode = colorMode;
        this.plugins = plugins;
    }

    public WrapperPreset() {
        this.ID = 0;
        this.nome = "";
        this.descrizione = "";
        this.mime = "";
        this.tipoReteNeurale = "";
        this.learningRate = 0.0;
        this.maxError = 0.0;
        this.maxErrorFunction = "";
        this.width = 0;
        this.height = 0;
        this.hiddenLayers = "";
        this.learningRule = "";
        this.transferFunction = "";
        this.colorMode = "";
        this.plugins = "";
    }

    public String getPlugins() {
        return plugins;
    }

    public void setPlugins(String plugins) {
        this.plugins = plugins;
    }

    public String getLearningRule() {
        return learningRule;
    }

    public String getTransferFunction() {
        return transferFunction;
    }

    public String getHiddenLayers() {
        return hiddenLayers;
    }

    public void setLearningRule(String learningRule) {
        this.learningRule = learningRule;
    }

    public void setTransferFunction(String transferFunction) {
        this.transferFunction = transferFunction;
    }

    public void setHiddenLayers(String hiddenLayers) {
        this.hiddenLayers = hiddenLayers;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getMime() {
        return mime;
    }

    public void setMime(String mime) {
        this.mime = mime;
    }

    public String getTipoReteNeurale() {
        return tipoReteNeurale;
    }

    public void setTipoReteNeurale(String tipoReteNeurale) {
        this.tipoReteNeurale = tipoReteNeurale;
    }

    public double getLearningRate() {
        return learningRate;
    }

    public void setLearningRate(double learningRate) {
        this.learningRate = learningRate;
    }

    public double getMaxError() {
        return maxError;
    }

    public void setMaxError(double maxError) {
        this.maxError = maxError;
    }

    public String getMaxErrorFunction() {
        return maxErrorFunction;
    }

    public void setMaxErrorFunction(String maxErrorFunction) {
        this.maxErrorFunction = maxErrorFunction;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getColorMode() {
        return colorMode;
    }

    public void setColorMode(String colorMode) {
        this.colorMode = colorMode;
    }

}
