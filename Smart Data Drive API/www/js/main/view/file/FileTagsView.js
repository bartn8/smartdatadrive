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

class FileTagsView extends View {
    constructor($this) {
        super($this);
        this.tags = new Array();
        this.isTagFileLinkEnabled = false;
    }

    updateView() {
        //Pulizia tags precedenti.
        this.$this.empty();

        var $row = $("<div class=\"row row-horizon\"></div>");

        for (var i = 0; i < this.tags.length; i++) {
            var $container = $("<div class=\"col-md-2\"><div class=\"btn-group\"><button type=\"button\" class=\"btn btn-default tagButton\"></button><button type=\"button\" class=\"btn btn-danger delTagButton\"><span class=\"glyphicon glyphicon-minus\"></span></button></div></div>");

            var $tagButton = $container.find(".tagButton");
            $tagButton.text(this.tags[i].name);

            var tagButtonContext = {
                index: i,
                filesTagsView: this,
                $this: $tagButton,
                tagID: this.tags[i].tagID,
                click: function (e) {
                    this.filesTagsView.$this.trigger("FileTagsView_tagButtonClick", [this.index, this.$this, this.tagID]);
                }
            };

            $tagButton.click($.proxy(tagButtonContext.click, tagButtonContext));

            var $delTagButton = $container.find(".delTagButton");
            
            if (this.isTagFileLinkEnabled) {
                var delTagButtonContext = {
                    index: i,
                    filesTagsView: this,
                    $this: $delTagButton,
                    click: function (e) {
                        this.filesTagsView.$this.trigger("FileTagsView_delTagButtonClick", [this.index, this.$this]);
                    }
                };

                $delTagButton.click($.proxy(delTagButtonContext.click, delTagButtonContext));
            }else{
                $delTagButton.remove();
            }

            $row.append($container);
        }

        //aggiungo funzione nuovo tag
        var $containerNewTag = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-primary\">[Nuovo Tag]</button></div>");
        var $buttonNewTag = $containerNewTag.find("button");

        var buttonNewTagContext = {
            filesTagsView: this,
            $this: $buttonNewTag,
            click: function (e) {
                this.filesTagsView.$this.trigger("FileTagsView_buttonNewTagClick", [this.$this]);
            }
        };

        $buttonNewTag.click($.proxy(buttonNewTagContext.click, buttonNewTagContext));

        $row.append($containerNewTag);

        //aggiungo funzione link tag file
        if (this.isTagFileLinkEnabled) {
            var $containerLinkFileTag = $("<div class=\"col-md-2\"><button type=\"button\" class=\"btn btn-block btn-primary\">[Collega Tag]</button></div>");
            var $buttonLinkFileTag = $containerLinkFileTag.find("button");

            var buttonLinkFileTagContext = {
                filesTagsView: this,
                $this: $buttonNewTag,
                click: function (e) {
                    this.filesTagsView.$this.trigger("FileTagsView_buttonLinkFileTagClick", [this.$this]);
                }
            };

            $buttonLinkFileTag.click($.proxy(buttonLinkFileTagContext.click, buttonLinkFileTagContext));

            $row.append($containerLinkFileTag);
        }

        this.$this.append($row);
    }

    setTags(tags) {
        this.tags = tags;
    }

    setFileTagLinkEnabled(bool) {
        this.isTagFileLinkEnabled = bool;
    }

}