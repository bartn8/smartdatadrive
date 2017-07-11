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
//$this: <div class="container-fluid" id="fileInfoView">
class FileInfoView extends View {

    constructor($this) {
        super($this);
        this.fileInfo = {};
    }

    updateView() {
        //Pulizia div.
        this.$this.empty();
        
        var $row = $("<div class=\"row\"><form class=\"fileInfoFormView\" style=\"display:none;\" action=\"php/download.php\" method=\"get\" target=\"_blank\"><input type=\"hidden\" name=\"asDownload\" value=\"0\"><input class=\"fileInfoHiddenFileHash\" type=\"hidden\" name=\"fileID\" value=\"0\"></form><form class=\"fileInfoFormDownload\" style=\"display:none;\" action=\"php/download.php\" method=\"get\" target=\"_blank\"><input type=\"hidden\" name=\"asDownload\" value=\"1\"><input class=\"fileInfoHiddenFileHash\" type=\"hidden\" name=\"fileID\" value=\"0\"></form><div class=\"col-md-12\"><div class=\"media\"><div class=\"media-left  media-top\"><img src=\"\" class=\"fileInfoIcon media-object\"></div><div class=\"media-body\"><h4 class=\"fileInfoFileName media-heading\"></h4><br><p><span class=\"label label-default\">Type:</span> <span class=\"fileInfoFileType\"></span></p><p><span class=\"label label-default\">MIME:</span> <span class=\"fileInfoFileMIME\"></span></p><p><span class=\"label label-default\">ID:</span> <span class=\"fileInfoFileHash\"></span></p><p><span class=\"label label-default\">Path:</span> <span class=\"fileInfoFilePath\"></span></p><hr><div class=\"jumbotron\"><h3>Informazioni</h3><p class=\"fileInfoFileInfo\"></p></div></div><div class=\"media-right media-top\"><div class=\"container-fluid media-object\"><div class=\"row\"><button type=\"button\" class=\"btn btn-block btn-default fileInfoDownloadButton\"> <span class=\"glyphicon glyphicon-download-alt\" style=\"font-size: 24px;\"></span></button><button type=\"button\" class=\"btn btn-block btn-default fileInfoViewButton\"> <span class=\"glyphicon glyphicon-eye-open\" style=\"font-size: 24px;\"></span></button></div></div></div></div></div>");

        var $fileInfoIcon = $row.find(".fileInfoIcon");
        var $fileInfoFileName = $row.find(".fileInfoFileName");
        var $fileInfoFileType = $row.find(".fileInfoFileType");
        var $fileInfoFileMIME = $row.find(".fileInfoFileMIME");
        var $fileInfoFileHash = $row.find(".fileInfoFileHash");
        var $fileInfoFilePath = $row.find(".fileInfoFilePath");
        var $fileInfoFileInfo = $row.find(".fileInfoFileInfo");
        var $fileInfoViewButton = $row.find(".fileInfoViewButton");
        var $fileInfoDownloadButton = $row.find(".fileInfoDownloadButton");
        var $fileInfoFormDownload = $row.find(".fileInfoFormDownload");
        var $fileInfoFormView = $row.find(".fileInfoFormView");
        var $fileInfoHiddenFileHash = $row.find(".fileInfoHiddenFileHash");

        $fileInfoHiddenFileHash.attr("value", this.fileInfo.fileID);
        $fileInfoIcon.attr("src", "images/default/file.png");
        $fileInfoFileName.text(this.fileInfo.name);
        $fileInfoFileType.text(this.fileInfo.type);
        $fileInfoFileMIME.text(this.fileInfo.mime);
        $fileInfoFileHash.text(this.fileInfo.fileID);
        $fileInfoFilePath.text(this.fileInfo.path);
        if (this.fileInfo.info != null) {
            $fileInfoFileInfo.text(window.atob(this.fileInfo.info));
        } else {
            $fileInfoFileInfo.text("");
        }

        var buttonViewContext = {
            fileInfoView: this,
            $this: $fileInfoDownloadButton,
            fileID: this.fileInfo.fileID,
            form: $fileInfoFormView,
            click: function (e) {
                this.fileInfoView.$this.trigger("FileInfoView_ViewButtonClick", [this.$this, this.fileID, this.form]);
            }
        };

        var buttonDownloadContext = {
            fileInfoView: this,
            $this: $fileInfoDownloadButton,
            fileID: this.fileInfo.fileID,
            form: $fileInfoFormDownload,
            click: function (e) {
                this.fileInfoView.$this.trigger("FileInfoView_DownloadButtonClick", [this.$this, this.fileID, this.form]);
            }
        };

        $fileInfoViewButton.click($.proxy(buttonViewContext.click, buttonViewContext));
        $fileInfoDownloadButton.click($.proxy(buttonDownloadContext.click, buttonDownloadContext));

        this.$this.append($row);
    }

    setFileInfo(fileInfo) {
        this.fileInfo = fileInfo;
    }
}