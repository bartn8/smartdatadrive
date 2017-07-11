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

//$("<div class=\"container-fluid\" id=\"fileView\"></div>")
class FileView extends View {

    constructor($this) {
        super($this);
        this.lsFile = new Array();
    }

    updateView() {
        //Pulizia div.
        this.$this.empty();

        var $row = $("<div class=\"row\"><div class=\"col-md-12\"></div></div>");
        var $col = $row.find(".col-md-12");

        for (var i = 0; i < this.lsFile.length; i++) {
            var $element = $("<div class=\"container-fluid fileBlock\"><div class=\"well-md\"><div class=\"media\"><div class=\"media-top\"><img class=\"media-object fileBlockIcon\" src=\"\"></div><div class=\"media-body\"><button type=\"button\" class=\"btn btn-info btn-xs center-block fileBlockButton\"></button></div></div></div></div>");

            var $fileBlock = $element;
            var $icon = $element.find(".fileBlockIcon");
            var $button = $element.find(".fileBlockButton");

            //$icon.attr("src", this.lsFile[i].icon);
            $icon.attr("src", "images/default/file.png");
            $button.text(this.lsFile[i].name);

            var buttonFontSize = parseInt($button.css("font-size"));
            var iconMaxWidth = parseInt($icon.css("max-width"));

            var buttonWidth = this.lsFile[i].name.length * (isNaN(buttonFontSize) ? 14 : buttonFontSize) * 0.5 + 20;
            var iconWidth = (isNaN(iconMaxWidth) ? 80 : iconMaxWidth) + 20;

            $fileBlock.css("max-width", Math.max(buttonWidth, iconWidth) + "px");

            var fileBlockContext = {
                fileView: this,
                fileID: this.lsFile[i].fileID,
                $this: $fileBlock,
                click: function (e) {
                    this.fileView.$this.trigger("FileView_fileBlockClick", [e, this.$this, this.fileID]);
                }
            };

            $fileBlock.click($.proxy(fileBlockContext.click, fileBlockContext));

            var buttonContext = {
                fileID: this.lsFile[i].fileID,
                fileView: this,
                $this: $button,
                click: function (e) {
                    this.fileView.$this.trigger("FileView_buttonClick", [e, this.$this, this.fileID]);
                }
            };

            $button.click($.proxy(buttonContext.click, buttonContext));

            $col.append($element);
        }

        this.$this.append($row);

    }

    setLsFile(lsFile) {
        this.lsFile = lsFile;
    }
}