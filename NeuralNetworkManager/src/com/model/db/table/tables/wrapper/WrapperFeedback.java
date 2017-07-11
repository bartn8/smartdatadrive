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
 * @author luca
 */
public class WrapperFeedback {

    private int seq, fileID, neuralID, tagID, presetID, userID;

    public WrapperFeedback() {
    }

    public WrapperFeedback(int seq, int fileID, int neuralID, int tagID, int presetID, int userID) {
        this.seq = seq;
        this.fileID = fileID;
        this.neuralID = neuralID;
        this.tagID = tagID;
        this.presetID = presetID;
        this.userID = userID;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public int getFileID() {
        return fileID;
    }

    public void setFileID(int fileID) {
        this.fileID = fileID;
    }

    public int getNeuralID() {
        return neuralID;
    }

    public void setNeuralID(int neuralID) {
        this.neuralID = neuralID;
    }

    public int getTagID() {
        return tagID;
    }

    public void setTagID(int tagID) {
        this.tagID = tagID;
    }

    public int getPresetID() {
        return presetID;
    }

    public void setPresetID(int presetID) {
        this.presetID = presetID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

}
