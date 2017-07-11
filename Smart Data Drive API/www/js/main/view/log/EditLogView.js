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

class EditLogView extends View {
    constructor($this) {
        super($this);
    }

    updateView() {
        this.$this.empty();
        
        var $clear = $("<button class=\"btn btn-xs btn-danger\" style=\"float:right;\"> <span class=\"glyphicon glyphicon-remove\" style=\"font-size: 24px;\"></span></button>");

        var contextClear = {
            $this: this.$this,
            $button: $clear,
            onClick: function (e) {
                this.$this.trigger("EditLogView_onClear", [this.$button]);
            }
        };

        $clear.click($.proxy(contextClear.onClick, contextClear));
        
        
        var $toggle = $("<input id=\"logToggle\" type=\"checkbox\" checked>");
        
        
        var contextToggle = {
            $this: this.$this,
            $button: $toggle,
            onToggle: function (e) {
                this.$this.trigger("EditLogView_onToggle", [this.$button]);
            }
        };

        $toggle.change($.proxy(contextToggle.onToggle, contextToggle));

        this.$this.append($toggle);
        this.$this.append($clear);
        
        $toggle.bootstrapToggle();
    }

}
