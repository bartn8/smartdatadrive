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


class FileUploadView extends View {

    constructor($this) {
        super($this);
        this.dropzone = {};
        this.dropzoneElement = "#" + this.$this.attr("id");
        this.previewsContainer = "#" + this.$this.attr("id") + " .previews";
        this.previewTemplate = "<div class=\"file-row\"><div class=\"media\"><div class=\"media-left\"><img data-dz-thumbnail class=\"media-object\" src=\"\"></div><div class=\"media-body\"><div class=\"media-heading\"><div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-6\"><h4><span data-dz-name></span> <small><span data-dz-size></span></small></h4></div><div class=\"col-md-6\"><div class=\"alert alert-danger alert-dismissible dropzone-alerterror\" style=\"display: none;\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Error! </strong><span data-dz-errormessage></span></div></div></div></div></div><div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-8\"><div class=\"progress progress-striped active largeProgress\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\"><div class=\"progress-bar progress-bar-success dropzone-progressbar\" style=\"width:0%;\"><span class=\"dropzone-progresslabel\"></span></div></div></div><div class=\"col-md-4\"><div class=\"btn-group\"><button class=\"btn btn-primary btn-sm dropzone-startuploadbutton\"><i class=\"glyphicon glyphicon-upload\"></i><span>Avvia Upload</span></button><button class=\"btn btn-danger btn-sm dropzone-removebutton\"><i class=\"glyphicon glyphicon-trash\"></i><span>Rimuovi</span></button></div></div></div></div></div></div></div>";
        this.$table = $("<div class=\"table table-striped previews\"></div>");
        
        this.$this.append(this.$table);
    }

    updateView() {
        //Dropzone gestisce in automatico
    }
    
}