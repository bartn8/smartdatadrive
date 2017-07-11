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

class BootboxNewTagDialog {

    constructor() {
        this.$container = $("<div></div>");
        //Contenuto vero.
        this.$container.append("<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Tag Padre</label><select class=\"form-control bootboxTagParentSelect\"></select></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"checkbox\"><label><input type=\"checkbox\" class=\"bootboxTagShareable\"> Condivisibile</label></div><div class=\"form-group\"><label>Nome Tag</label><input type=\"text\" class=\"form-control bootboxTagName\"></div><div class=\"form-group\"><label>Descrizione</label><textarea class=\"form-control bootboxTagDesc\"></textarea></div></div></div></div>");
        //Aggiungo tag parent vuoto
        var $select = this.$container.find(".bootboxTagParentSelect");
        var $option = $("<option></option>");
        $option.attr("value", "-1");
        $option.text("Nessun tag padre");
        $select.append($option);
    }

    setTags(tags) {
        var $select = this.$container.find(".bootboxTagParentSelect");
        $select.empty();

        //Aggiungo tag parent vuoto
        var $option = $("<option></option>");
        $option.attr("value", "-1");
        $option.text("Nessun tag padre");
        $select.append($option);

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
