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


class EditorImageOptionsView extends View {
    constructor($this) {
        super($this);
        this.options = new Array();
    }

    updateView() {
        this.$this.empty();
        this.$options = new Array();
        
        var $row = $("<div class=\"row\"></div>");

        var $trainButton = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\">Addestra</button></div>");
        var $clearButton = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\">Pulisci</button></div>");
        var $presetButton = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-danger\">Seleziona Preset</button></div>");
        var $exitButton = $("<div class=\"col-md-2\"><button class=\"btn btn-block btn-default\"> <span class=\"glyphicon glyphicon-remove\" style=\"font-size: 24px;\"></span></button></div>");

        this.$options[0] = $trainButton;
        this.$options[1] = $clearButton;
        this.$options[2] = $presetButton;
        this.$options[3] = $("<div class=\"col-md-2\"></div>");
        this.$options[4] = $("<div class=\"col-md-2\"></div>");
        this.$options[5] = $exitButton;

        for (var i = 0; i < this.$options.length; i++) {
            var $option = this.$options[i];

            var context = {
                filesOptionsView: this,
                $this: $option.find("button"),
                index: i,
                click: function () {
                    this.filesOptionsView.$this.trigger("EditorImageOptionView_buttonClick", [this.index, this.$this]);
                }
            };

            $option.find("button").click($.proxy(context.click, context));

            $row.append($option);
        }
        
        this.$this.append($row);
    }

    enableOnly(indexs) {
        this.enableAll();

        for (var i = 0; i < this.$options.length; i++) {
            for (var j = 0; j < indexs.length; j++) {
                if (i !== indexs[j]) {
                    this.$options[i].addClass("disabled");
                }
            }
        }
    }

    disableOnly(indexs) {
        this.enableAll();

        for (var i = 0; i < this.$options.length; i++) {
            for (var j = 0; j < indexs.length; j++) {
                if (i === indexs[j]) {
                    this.$options[i].addClass("disabled");
                }
            }
        }
    }

    enableAll() {
        for (var i = 0; i < this.$options.length; i++) {
            this.$options[i].removeClass("disabled");
        }
    }

    disableAll() {
        for (var i = 0; i < this.$options.length; i++) {
            this.$options[i].addClass("disabled");
        }
    }
    
    presetSelected(){
        this.$options[2].find("button").removeClass("btn-danger");
        this.$options[2].find("button").addClass("btn-success");
    }
    
    presetDelesected(){
        this.$options[2].find("button").removeClass("btn-success");
        this.$options[2].find("button").addClass("btn-danger");
    }
}