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
class FileSuggestedTagsView extends View {

    constructor($this) {
        super($this);
        this.suggestedTags = new Array();
    }

    updateView() {
        this.$this.empty();

        var $row = $("<div class=\"row row-horizon\"></div>");

        for (var i = 0; i < this.suggestedTags.length; i++) {
            var $container = $("<div class=\"col-md-4\"><div class=\"btn-group\"><button type=\"button\" class=\"btn btn-default sugTagButton\"></button><button type=\"button\" class=\"btn btn-success addSugTagButton\"><span class=\"glyphicon glyphicon-plus\"></span></button><button type=\"button\" class=\"btn btn-danger delSugTagButton\"><span class=\"glyphicon glyphicon-minus\"></span></button></div></div>");

            var $sugTagButton = $container.find(".sugTagButton");
            $sugTagButton.text(this.suggestedTags[i].name + " (" + Math.round(this.suggestedTags[i].riscontro * 1000) / 10 + " %)");

            var sugTagButtonContext = {
                tagID: this.suggestedTags[i].tagID,
                index: i,
                seq: this.suggestedTags[i].seq,
                fileSuggestedTagsView: this,
                $this: $sugTagButton,
                click: function (e) {
                    this.fileSuggestedTagsView.$this.trigger("FileSuggestedTagsView_sugTagButtonClick", [this.seq, this.tagID, this.index, this.$this]);
                }
            };

            $sugTagButton.click($.proxy(sugTagButtonContext.click, sugTagButtonContext));

            var $addSugTagButton = $container.find(".addSugTagButton");

            var addSugTagButtonContext = {
                tagID: this.suggestedTags[i].tagID,
                seq: this.suggestedTags[i].seq,
                index: i,
                fileSuggestedTagsView: this,
                $this: $addSugTagButton,
                click: function (e) {
                    this.fileSuggestedTagsView.$this.trigger("FileSuggestedTagsView_addSugTagButtonClick", [this.seq, this.tagID, this.index, this.$this]);
                }
            };

            $addSugTagButton.click($.proxy(addSugTagButtonContext.click, addSugTagButtonContext));

            var $delSugTagButton = $container.find(".delSugTagButton");

            var delSugTagButtonContext = {
                index: i,
                tagID: this.suggestedTags[i].tagID,
                fileSuggestedTagsView: this,
                seq: this.suggestedTags[i].seq,
                $this: $delSugTagButton,
                click: function (e) {
                    this.fileSuggestedTagsView.$this.trigger("FileSuggestedTagsView_delSugTagButtonClick", [this.seq, this.tagID, this.index, this.$this]);
                }
            };

            $delSugTagButton.click($.proxy(delSugTagButtonContext.click, delSugTagButtonContext));

            $row.append($container);
        }

        this.$this.append($row);
    }

    setSuggestedTags(tags) {
        this.suggestedTags = tags;
    }

}
