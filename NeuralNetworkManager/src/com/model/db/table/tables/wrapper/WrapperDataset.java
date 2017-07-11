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

import java.sql.Timestamp;

/**
 *
 * @author luca
 */
public class WrapperDataset {

    private int id;
    private int neuralID;
    private int fileID;
    private double maxError;
    private int inputLayers;
    private int outputLayers;
    private Timestamp dataCreazione;

    public WrapperDataset() {
        dataCreazione = new Timestamp(System.currentTimeMillis());
    }

    public WrapperDataset(int id, int neuralID, int fileID, double maxError, int inputLayers, int outputLayers, Timestamp dataCreazione) {
        this.id = id;
        this.neuralID = neuralID;
        this.fileID = fileID;
        this.maxError = maxError;
        this.inputLayers = inputLayers;
        this.outputLayers = outputLayers;
        this.dataCreazione = dataCreazione;
    }

    public double getMaxError() {
        return maxError;
    }

    public void setMaxError(double maxError) {
        this.maxError = maxError;
    }

    public int getInputLayers() {
        return inputLayers;
    }

    public void setInputLayers(int inputLayers) {
        this.inputLayers = inputLayers;
    }

    public int getOutputLayers() {
        return outputLayers;
    }

    public void setOutputLayers(int outputLayers) {
        this.outputLayers = outputLayers;
    }

    public int getID() {
        return id;
    }

    public void setID(int id) {
        this.id = id;
    }

    public int getNeuralID() {
        return neuralID;
    }

    public void setNeuralID(int neuralID) {
        this.neuralID = neuralID;
    }

    public int getFileID() {
        return fileID;
    }

    public void setFileID(int fileID) {
        this.fileID = fileID;
    }

    public Timestamp getDataCreazione() {
        return dataCreazione;
    }

    public void setDataCreazione(Timestamp dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    @Override
    public String toString() {
        return "WrapperDataset{" + "id=" + id + ", neuralID=" + neuralID + ", fileID=" + fileID + ", maxError=" + maxError + ", inputLayers=" + inputLayers + ", outputLayers=" + outputLayers + ", dataCreazione=" + dataCreazione + '}';
    }

}
