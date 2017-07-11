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

class TreeView extends View {
    constructor($this) {
        super($this);
        this.lsDir = new Array();
        this.mainDir = {
            hash: 0,
            dirName: "root"
        };
    }

    updateView() {
        this.$this.empty();

        var $main = $("<div class=\"row\"><div class=\"col-md-12\"><div class=\"panel panel-default\"><div class=\"panel-body\"><span class=\"treeViewDir\"></span></div></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"list-group treeViewContainer\"></div></div></div>");

        var $mainDir = $main.find(".treeViewDir");
        $mainDir.text(this.mainDir.dirName);

        var $containerDirs = $main.find(".treeViewContainer");

        //Aggiungo la funzione "cartella superiore (..)" (All' inizio)
        this.lsDir.unshift({
            dirName: "..",
            fileID: 0,
            upperDir: true
        });

        //Aggiungo la funzione "nuova cartella" (Alla fine)
        this.lsDir.push({
            dirName: "Nuova Cartella",
            fileID: 0,
            newFolder: true
        });

        for (var i = 0; i < this.lsDir.length; i++) {
            var $row = $("<a href=\"#\" class=\"list-group-item\"></a>");
            $row.text(this.lsDir[i].dirName);

            var context = {
                $this : this.$this,
                dir: this.lsDir[i],
                onClick: function (e) {
                    this.$this.trigger("TreeView_onButtonClick", [this.dir]);
                }
            };

            $row.click($.proxy(context.onClick, context));

            $containerDirs.append($row);
        }
        
        this.$this.append($main);
    }

    setLsDir(lsDir){
        this.lsDir = lsDir;
    }
    
    setMainDir(mainDir){
        this.mainDir = mainDir;
    }
    
    clearLsDir(){
        this.lsDir = new Array();
    }
    
}