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
public class WrapperPresetFiltroLink {

    private int seq;
    private int presetID;
    private int filterID;

    public WrapperPresetFiltroLink(int seq, int presetID, int filterID) {
        this.seq = seq;
        this.presetID = presetID;
        this.filterID = filterID;
    }

    public WrapperPresetFiltroLink() {
        this.seq = 0;
        this.presetID = 0;
        this.filterID = 0;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public int getPresetID() {
        return presetID;
    }

    public void setPresetID(int presetID) {
        this.presetID = presetID;
    }

    public int getFilterID() {
        return filterID;
    }

    public void setFilterID(int filterID) {
        this.filterID = filterID;
    }

}
