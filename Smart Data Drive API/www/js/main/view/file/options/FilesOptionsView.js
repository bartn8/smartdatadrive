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

//var $col = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-default\">Default</button></div>");
//
//Taglia Copia Incolla.
//Massimo 6 funzioni perche col-md-2
//-----Le funzioni saranno attivate solo se c'è selezione.-----
//Funzione upload con opzioni avanzate

class FilesOptionsView extends View {

    constructor($this) {
        super($this);
        this.$options = new Array();
    }

    updateView() {
        this.$this.empty();
        this.$options = new Array();
        
        var $row = $("<div class=\"row\"></div>");

        var $annulla = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-default\">Annulla</button></div>");
        var $taglia = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-default\">Taglia</button></div>");
        var $copia = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-default\">Copia</button></div>");
        var $incolla = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-default\">Incolla</button></div>");
        var $elimina = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-default\">Elimina</button></div>");
        var $upload = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-info\">Carica File</button></div>");

        this.$options[0] = $annulla;
        this.$options[1] = $taglia;
        this.$options[2] = $copia;
        this.$options[3] = $incolla;
        this.$options[4] = $elimina;
        this.$options[5] = $upload;

        for (var i = 0; i < this.$options.length; i++) {
            var $option = this.$options[i];

            var optionContext = {
                filesOptionsView: this,
                $this: $option,
                index: i,
                click: function () {
                    this.filesOptionsView.$this.trigger("FilesOptionsView_buttonClick", [this.index, this.$this]);
                }
            };
            
            $option.children("button").click($.proxy(optionContext.click, optionContext));
            
            $row.append($option);
        }
        
        this.$this.append($row);

        //Abilito solo l' upload. Per il resto necessità di selezione.
        this.enableOnly([5]);
    }

    enableOnly(indexs) {
        this.enableAll();
        
        for (var i = 0; i < this.$options.length; i++) {
            for (var j = 0; j < indexs.length; j++) {
                if (i !== indexs[j]) {
                    this.$options[i].children("button").addClass("disabled");
                }
            }
        }
    }

    disableOnly(indexs) {
        this.enableAll();
        
        for (var i = 0; i < this.$options.length; i++) {
            for (var j = 0; j < indexs.length; j++) {
                if (i === indexs[j]) {
                    this.$options[i].children("button").addClass("disabled");
                }
            }
        }
    }

    enableAll() {
        for (var i = 0; i < this.$options.length; i++) {
            this.$options[i].children("button").removeClass("disabled");
        }
    }

    disableAll() {
        for (var i = 0; i < this.$options.length; i++) {
            this.$options[i].children("button").addClass("disabled");
        }
    }
}