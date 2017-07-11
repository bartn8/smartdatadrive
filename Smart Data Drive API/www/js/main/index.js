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

/* global bootbox, PDFJS, odf */

$(document).ready(function () {
    var $interface = $("<div id=\"interface\"></div>");

    var $fileView = $("#fileView");
    var $treeView = $("#treeView");
    var $fileInfoView = $("#fileInfoView");
    var $fileTagsView = $("#fileTagsView");
    var $fileOptionsView = $("#fileOptionsView");
    var $filesOptionsView = $("#filesOptionsView");
    var $fileUploadView = $("#fileUploadView");
    var $fileUploadOptionsView = $("#fileUploadOptionsView");
    var $editorImageView = $("#editorImageView");
    var $editorImageOptionsView = $("#editorImageOptionsView");
    var $fileSuggestedTagsView = $("#fileSuggestedTagsView");

    var fileController = new FileController(
            $interface,
            $fileView,
            $treeView,
            $fileInfoView,
            $fileTagsView,
            $fileOptionsView,
            $filesOptionsView,
            $fileUploadView,
            $fileUploadOptionsView,
            $editorImageView,
            $editorImageOptionsView,
            $fileSuggestedTagsView
            );


    var $neuralView = $("#neuralView");

    var neuralController = new NeuralController(
            $interface,
            $neuralView
            );

    var $accountInfoView = $("#accountInfoView");

    var footerController = new FooterController(
            $interface,
            $accountInfoView
            );

    var $logView = $("#logView");
    var $editLogView = $("#editLogView");

    var logController = new LogController(
            $interface,
            $logView,
            $editLogView
            );

    fileController.init();
    neuralController.init();
    footerController.init();
    logController.init();
});