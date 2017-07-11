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


class FileOptionsView extends View {
    constructor($this) {
        super($this);
        this.$options = new Array();
    }

    updateView() {
        this.$this.empty();
        this.$options = new Array();

        var $row = $("<div class=\"row\"></div>");

        var $rinomina = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\">Rinomina</button></div>");
        var $elimina = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\">Elimina</button></div>");
        var $cambiaInfo = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\">Cambia Informazioni</button></div>");
        var $analizza = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\">Analizza file</button></div>");
        var $close = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\"> <span class=\"glyphicon glyphicon-remove media-object\" style=\"font-size: 24px;\"></span></button></div>");

        this.$options[0] = $rinomina;
        this.$options[1] = $elimina;
        this.$options[2] = $cambiaInfo;
        this.$options[3] = $analizza;
        this.$options[4] = $("<div class=\"col-md-2\"></div>");
        this.$options[5] = $close;


        for (var i = 0; i < this.$options.length; i++) {
            var $option = this.$options[i];

            var optionContext = {
                filesOptionsView: this,
                $this: $option,
                index: i,
                click: function () {
                    this.filesOptionsView.$this.trigger("FileOptionsView_buttonClick", [this.index, this.$this]);
                }
            };

            $option.children("button").click($.proxy(optionContext.click, optionContext));

            $row.append($option);
        }

        this.$this.append($row);
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