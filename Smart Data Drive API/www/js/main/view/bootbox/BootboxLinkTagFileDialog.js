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

class BootboxLinkTagFileDialog {
    constructor() {
        this.$container = $("<div></div>");
        this.$container.append("<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Tag da collegare</label><select class=\"form-control bootboxTagIDSelect\"></select></div></div></div></div>");
    }

    setTags(tags) {
        var $select = this.$container.find(".bootboxTagIDSelect");
        $select.empty();

        for (var i = 0; i < tags.length; i++) {
            var $option = $("<option></option>");
            $option.attr("value", tags[i].tagID);
            $option.text(tags[i].name);
            $select.append($option);
        }
    }

    get toHTML() {
        return this.$container.html();
    }

    get loadingHTML() {
        return "<div class=\"media\"><div class=\"media-left\"><div class=\"loader\"></div></div><div class=\"media-body\"><h4 class=\"media-heading\">Caricamento...</h4><p>Ricerca di tag disponibili...</p></div></div>";
    }
}
