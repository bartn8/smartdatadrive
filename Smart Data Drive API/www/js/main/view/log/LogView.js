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

class LogView extends View {

    constructor($this) {
        super($this);
        //this.list = new Array();
        this.$div = $("<div></div>");
        this.$col = $("<div></div>");
    }

    updateView() {
        this.$this.empty();
        this.$div = $("<div class=\"row\"><div class=\"col-md-12\"></div></div>");
        this.$col = this.$div.find("div");
        this.$this.append(this.$div);
    }

    log(title, message, level) {
        var $row = $("");
        switch (level) {
            case 0:
            {//Success
                $row = $("<div class=\"alert alert-success\"><a class=\"logClick close\" aria-label=\"close\">&times;</a><strong class=\"logTitle\"></strong> <span class=\"logText\"></span></div>");
                break;
            }
            case 1:
            {//Warning
                $row = $("<div class=\"alert alert-warning\"><a class=\"logClick close\" aria-label=\"close\">&times;</a><strong class=\"logTitle\"></strong> <span class=\"logText\"></span></div>");
                break;
            }
            case 2:
            {//Error
                $row = $("<div class=\"alert alert-danger\"><a class=\"logClick close\" aria-label=\"close\">&times;</a><strong class=\"logTitle\"></strong> <span class=\"logText\"></span></div>");
                break;
            }
            default:
            {
                $row = $("<div class=\"alert alert-info\"><a class=\"logClick close\" aria-label=\"close\">&times;</a><strong class=\"logTitle\"></strong> <span class=\"logText\"></span></div>");
                break;
            }
        }

        var $logClick = $row.find(".logClick");
        var $logTitle = $row.find(".logTitle");
        var $logText = $row.find(".logText");

        $logTitle.text(title);
        $logText.text(message);

        var clickContext = {
            $this: $row,
            index: 0,//this.list.length,
            onClick: function (e) {
                this.$this.trigger("LogView_onClick", [this.$this, this.index]);
            }
        };

        $logClick.click($.proxy(clickContext.onClick, clickContext));
        
        //this.list.push($row);
        this.$col.append($row);
    }
}
