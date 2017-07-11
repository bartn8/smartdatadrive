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
public class WrapperRiscontro {

    private int seq;
    private int neuralID;
    private int fileID;
    private double riscontro;

    public WrapperRiscontro() {
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
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

    public double getRiscontro() {
        return riscontro;
    }

    public void setRiscontro(double riscontro) {
        this.riscontro = riscontro;
    }

}
