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

class TagSelection {

    constructor() {
        this.selectionEnabled = true;
        this.selectionState = 0;
        this.selectedTagID = new Array();
    }

    undoSelection() {
        this.selectedTagID = new Array();
        this.selectionEnabled = true;
        this.selectionState = 0;
    }

    setSelectionState(state) {
        this.selectionState = state;
    }

    enableSelection() {
        this.selectionEnabled = true;
    }

    disableSelection() {
        this.selectionEnabled = false;
    }

    toggleSelection(tagID) {
        if (this.selectionEnabled) {
            var found = -1;
            for (var i = 0; i < this.selectedTagID.length; i++) {
                if (this.selectedTagID[i] === tagID) {
                    found = i;
                }
            }
            if (found === -1) {
                this.selectedTagID.push(tagID);
            }else{
                this.selectedTagID.splice(found, 1);
            }
        }
    }
    
    isEmpty(){
        return this.selectedTagID.length === 0;
    }
    
}
