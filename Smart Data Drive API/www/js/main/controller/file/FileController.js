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

/*
 * TODO 1.2 Suddivisione File Controller e gli altri.
 * FileController va suddiviso per area.
 * Ogni view avrÃ  proprio controller e proprio model giÃ  fatto.
 * I sub-controller avranno context in comune.
 */

/* global bootbox */

class FileController extends Controller {

    static getBootboxDialog() {
        return this.bootboxDialog;
    }

    static setBootboxDialog(dialog) {
        this.bootboxDialog = dialog;
    }

    constructor($interface, $fileView, $treeView, $fileInfoView, $fileTagsView, $fileOptionsView, $filesOptionsView, $fileUploadView, $fileUploadOptionsView, $editorImageView, $editorImageOptionsView, $fileSuggestedTagsView) {
        super($interface);

        //Views
        this.fileView = new FileView($fileView);
        this.treeView = new TreeView($treeView);
        this.fileInfoView = new FileInfoView($fileInfoView);
        this.fileTagsView = new FileTagsView($fileTagsView);
        this.filesOptionsView = new FilesOptionsView($filesOptionsView);
        this.fileOptionsView = new FileOptionsView($fileOptionsView);
        this.fileUploadView = new FileUploadView($fileUploadView);
        this.fileUploadOptionsView = new FileUploadOptionsView($fileUploadOptionsView);
        this.fileSuggestedTagsView = new FileSuggestedTagsView($fileSuggestedTagsView);
        //Views - EDITOR
        this.editorImageView = new EditorImageView($editorImageView);
        this.editorImageOptionsView = new EditorImageOptionsView($editorImageOptionsView);
        //Views - BOOTBOX
        this.bootboxNewTagDialog = new BootboxNewTagDialog();
        this.bootboxLinkTagFileDialog = new BootboxLinkTagFileDialog();
        this.bootboxSelectPresetDialog = new BootboxSelectPresetDialog();
        this.bootboxSelectPresetDynamicView;

        //Models
        this.fileData = new FileData();
        this.fileInfoData = new FileInfoData();
        this.treeData = new TreeData();
        this.tagsData = new TagsData();
        this.fileSelection = new FileSelection();
        this.tagSelection = new TagSelection();
        this.fileOptionsData = new FileOptionsData();
        this.filesOptionsData = new FilesOptionsData();
        this.fileSuggestedTagsData = new FileSuggestedTagsData();
        this.dropzoneData = new DropzoneData();
        this.feedbackData = new FeedbackData();
        //Models - EDITOR
        this.editorImageData = new EditorImageData();

        //Oggetto Dropzone
        this.dropzone = new Dropzone(this.fileUploadView.dropzoneElement, {
            url: this.dropzoneData.url,
            thumbnailWidth: this.dropzoneData.thumbnailWidth,
            thumbnailHeight: this.dropzoneData.thumbnailHeight,
            parallelUploads: this.dropzoneData.parallelUploads,
            autoQueue: this.dropzoneData.autoQueque,
            maxFilesize: this.dropzoneData.maxFileSize,
            previewsContainer: this.fileUploadView.previewsContainer,
            previewTemplate: this.fileUploadView.previewTemplate
        });

        //Context della classe, gestisce la cartella di root le view etc
        this.context = {
            mainDir: {
                dirName: "Drive",
                dirID: 0
            },
            fileID: 0,
            currentView: -1,
            filteredTagIndex: -1,
            editor: {
                tagID: 0,
                datasetID: 0
            }
        };

        //Context di callback delle view
        this.treeViewContext = new Object();
        this.fileViewContext = new Object();
        this.fileInfoViewContext = new Object();
        this.fileTagsViewContext = new Object();
        this.fileOptionsViewContext = new Object();
        this.filesOptionsViewContext = new Object();
        this.fileUploadViewContext = new Object();
        this.fileUploadOptionsViewContext = new Object();
        this.fileSuggestedTagsViewContext = new Object();
        this.dropzoneContext = new Object();
        this.editorImageViewCanvasContext = new Object();
        this.editorImageOptionsViewContext = new Object();

        //context di callback dell' interfaccia
        this.interfaceContext = new Object();
    }

    init() {
        //INIT
        this.initFileView();
        this.initFileInfoView();
        this.initFileUploadView();
        this.initEditorImageView();

        this.hideAll();

        //Ascolto delle Views
        this.treeViewContext["fileController"] = this;
        this.treeViewContext["onButtonClick"] = this.treeView_onButtonClick;

        this.fileViewContext["fileController"] = this;
        this.fileViewContext["onButtonClick"] = this.fileView_onButtonClick;
        this.fileViewContext["onFileBlockClick"] = this.fileView_onFileBlockClick;

        this.fileInfoViewContext["fileController"] = this;
        this.fileInfoViewContext["onViewButtonClick"] = this.fileInfoView_onViewButtonClick;
        this.fileInfoViewContext["onDownloadButtonClick"] = this.fileInfoView_onDownloadButtonClick;

        this.fileTagsViewContext["fileController"] = this;
        this.fileTagsViewContext["onTagButtonClick"] = this.fileTagsView_onTagButtonClick;
        this.fileTagsViewContext["onDelTagButtonClick"] = this.fileTagsView_onDelTagButtonClick;
        this.fileTagsViewContext["onButtonNewTagClick"] = this.fileTagsView_onButtonNewTagClick;
        this.fileTagsViewContext["onButtonLinkFileTagClick"] = this.fileTagsView_onButtonLinkFileTagClick;

        this.fileOptionsViewContext["fileController"] = this;
        this.fileOptionsViewContext["onButtonClick"] = this.fileOptionsView_onButtonClick;

        this.filesOptionsViewContext["fileController"] = this;
        this.filesOptionsViewContext["onButtonClick"] = this.filesOptionsView_onButtonClick;

        this.fileUploadViewContext["fileController"] = this;

        this.fileUploadOptionsViewContext["fileController"] = this;
        this.fileUploadOptionsViewContext["onButtonClick"] = this.fileUploadOptionsView_onButtonClick;

        this.fileSuggestedTagsViewContext["fileController"] = this;
        this.fileSuggestedTagsViewContext["onAddSugTagButtonClick"] = this.fileSuggestedTagsView_onAddSugTagButtonClick;
        this.fileSuggestedTagsViewContext["onDelSugTagButtonClick"] = this.fileSuggestedTagsView_onDelSugTagButtonClick;

        this.editorImageOptionsViewContext["fileController"] = this;
        this.editorImageOptionsViewContext["onButtonClick"] = this.editorImageOptionView_onButtonClick;

        this.editorImageViewCanvasContext["fileController"] = this;
        this.editorImageViewCanvasContext["onMousedown"] = this.editorImageViewCanvas_onMousedown;
        this.editorImageViewCanvasContext["onMousemove"] = this.editorImageViewCanvas_onMousemove;
        this.editorImageViewCanvasContext["onMouseleave"] = this.editorImageViewCanvas_onMouseleave;
        this.editorImageViewCanvasContext["onMouseup"] = this.editorImageViewCanvas_onMouseup;

        //Pluginnssss
        this.dropzoneContext["fileController"] = this;
        this.dropzoneContext["onAddedFile"] = this.dropzone_onAddedFile;
        this.dropzoneContext["onError"] = this.dropzone_onError;
        this.dropzoneContext["onSending"] = this.dropzone_onSending;
        this.dropzoneContext["onUploadProgress"] = this.dropzone_onUploadProgress;
        this.dropzoneContext["onThumbnail"] = this.dropzone_onThumbnail;

        this.fileView.$this.on("FileView_buttonClick", $.proxy(this.fileViewContext.onButtonClick, this.fileViewContext));
        this.fileView.$this.on("FileView_fileBlockClick", $.proxy(this.fileViewContext.onFileBlockClick, this.fileViewContext));
        this.fileInfoView.$this.on("FileInfoView_DownloadButtonClick", $.proxy(this.fileInfoViewContext.onDownloadButtonClick, this.fileInfoViewContext));
        this.fileInfoView.$this.on("FileInfoView_ViewButtonClick", $.proxy(this.fileInfoViewContext.onViewButtonClick, this.fileInfoViewContext));
        this.fileTagsView.$this.on("FileTagsView_tagButtonClick", $.proxy(this.fileTagsViewContext.onTagButtonClick, this.fileTagsViewContext));
        this.fileTagsView.$this.on("FileTagsView_delTagButtonClick", $.proxy(this.fileTagsViewContext.onDelTagButtonClick, this.fileTagsViewContext));
        this.fileTagsView.$this.on("FileTagsView_buttonNewTagClick", $.proxy(this.fileTagsViewContext.onButtonNewTagClick, this.fileTagsViewContext));
        this.fileTagsView.$this.on("FileTagsView_buttonLinkFileTagClick", $.proxy(this.fileTagsViewContext.onButtonLinkFileTagClick, this.fileTagsViewContext));
        this.fileOptionsView.$this.on("FileOptionsView_buttonClick", $.proxy(this.fileOptionsViewContext.onButtonClick, this.fileOptionsViewContext));
        this.filesOptionsView.$this.on("FilesOptionsView_buttonClick", $.proxy(this.filesOptionsViewContext.onButtonClick, this.filesOptionsViewContext));
        this.editorImageOptionsView.$this.on("EditorImageOptionView_buttonClick", $.proxy(this.editorImageOptionsViewContext.onButtonClick, this.editorImageOptionsViewContext));
        this.fileUploadOptionsView.$this.on("FileUploadOptionsView_buttonClick", $.proxy(this.fileUploadOptionsViewContext.onButtonClick, this.fileUploadOptionsViewContext));
        this.treeView.$this.on("TreeView_onButtonClick", $.proxy(this.treeViewContext.onButtonClick, this.treeViewContext));
        this.fileSuggestedTagsView.$this.on("FileSuggestedTagsView_addSugTagButtonClick", $.proxy(this.fileSuggestedTagsViewContext.onAddSugTagButtonClick, this.fileSuggestedTagsViewContext));
        this.fileSuggestedTagsView.$this.on("FileSuggestedTagsView_delSugTagButtonClick", $.proxy(this.fileSuggestedTagsViewContext.onDelSugTagButtonClick, this.fileSuggestedTagsViewContext));

        //Pluginss
        this.dropzone.on("addedfile", $.proxy(this.dropzoneContext.onAddedFile, this.dropzoneContext));
        this.dropzone.on("error", $.proxy(this.dropzoneContext.onError, this.dropzoneContext));
        this.dropzone.on("sending", $.proxy(this.dropzoneContext.onSending, this.dropzoneContext));
        this.dropzone.on("uploadprogress", $.proxy(this.dropzoneContext.onUploadProgress, this.dropzoneContext));
        this.dropzone.on("thumbnail", $.proxy(this.dropzoneContext.onThumbnail, this.dropzoneContext));

        //Ascolto dell' interfaccia...
        this.interfaceContext["fileController"] = this;
        this.interfaceContext["onEditorClick"] = this.neuralController_onEditorClick;
        this.interfaceContext["onLoginSuccessful"] = this.footerController_onLoginSuccessful;
        this.interfaceContext["onLogoutSuccessful"] = this.footerController_onLogoutSuccessful;
        this.interfaceContext["onAccountStatus"] = this.footerController_onAccountStatus;

        this.on("NeuralController_EditorClick", $.proxy(this.interfaceContext.onEditorClick, this.interfaceContext));
        this.on("FooterController_accountStatus", $.proxy(this.interfaceContext.onAccountStatus, this.interfaceContext));
        this.on("FooterController_loginSuccessful", $.proxy(this.interfaceContext.onLoginSuccessful, this.interfaceContext));
        this.on("FooterController_logoutSuccessful", $.proxy(this.interfaceContext.onLogoutSuccessful, this.interfaceContext));
    }

    fileSuggestedTagsView_onAddSugTagButtonClick(e, seq, tagID, index, $button) {
        var confirmContext = {
            fileController: this.fileController,
            seq: seq,
            tagID: tagID,
            fileID: this.fileController.context.fileID,
            confirm: function (result) {
                if (result) {
                    //Aggunta collegamento file tag

                    var addFileTagLinkContext = {
                        fileController: this.fileController,
                        onSuccess: function (response) {
                            //Sarebbe meglio sostituire con solo aggiornamento dei tag.
                            this.fileController.viewFileInfoView();
                        },
                        onError: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile collegare il file con il tag (" + response.code + ")", 2]);
                        }
                    };

                    this.fileController.tagsData.ajaxAddFileTagLink(this.tagID, this.fileID, $.proxy(addFileTagLinkContext.onSuccess, addFileTagLinkContext), $.proxy(addFileTagLinkContext.onError, addFileTagLinkContext));

                    //Aggiunta feedback positivo

                    var positiveFeedbackContext = {
                        fileController: this.fileController,
                        tagID: this.tagID,
                        fileID: this.fileID,
                        onSuccess: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Feedback", "Feedback positivo aggiunto", 0]);

                            //Rimozione del suggerimento

                            var delSuggestedTagContext = {
                                fileController: this.fileController,
                                onSuccess: function (response) {
                                    //Sarebbe meglio sostituire con solo aggiornamento dei tag.
                                    this.fileController.viewFileInfoView();
                                },
                                onError: function (response) {
                                    this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile rimuovere il tag suggerito (" + response.code + ")", 2]);
                                }
                            };

                            this.fileController.fileSuggestedTagsData.ajaxRemoveSuggestedTag(this.tagID, this.fileID, $.proxy(delSuggestedTagContext.onSuccess, delSuggestedTagContext), $.proxy(delSuggestedTagContext.onError, delSuggestedTagContext));
                        },
                        onError: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile aggiungere feedback (" + response.code + ")", 2]);
                        }
                    };

                    this.fileController.feedbackData.ajaxAddPositiveFeedback(this.seq, this.fileID, $.proxy(positiveFeedbackContext.onSuccess, positiveFeedbackContext), $.proxy(positiveFeedbackContext.onError, positiveFeedbackContext));

                }
            }
        };

        bootbox.confirm("Sei sicuro di voler aggiungere il tag suggerito? (Feedback positivo)", $.proxy(confirmContext.confirm, confirmContext));
    }

    fileSuggestedTagsView_onDelSugTagButtonClick(e, seq, tagID, index, $button) {
        var confirmContext = {
            fileController: this.fileController,
            tagID: tagID,
            seq: seq,
            fileID: this.fileController.context.fileID,
            confirm: function (result) {
                if (result) {
                    //Aggiunta feedback negativo
                    var negativeFeedbackContext = {
                        fileController: this.fileController,
                        tagID: this.tagID,
                        fileID: this.fileID,
                        onSuccess: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Feedback", "Feedback negativo aggiunto", 0]);

                            //Rimozione del suggerimento

                            var delSuggestedTagContext = {
                                fileController: this.fileController,
                                onSuccess: function (response) {
                                    //Sarebbe meglio sostituire con solo aggiornamento dei tag.
                                    this.fileController.viewFileInfoView();
                                },
                                onError: function (response) {
                                    this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile rimuovere il tag suggerito (" + response.code + ")", 2]);
                                }
                            };

                            this.fileController.fileSuggestedTagsData.ajaxRemoveSuggestedTag(this.tagID, this.fileID, $.proxy(delSuggestedTagContext.onSuccess, delSuggestedTagContext), $.proxy(delSuggestedTagContext.onError, delSuggestedTagContext));
                        },
                        onError: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile aggiungere feedback (" + response.code + ")", 2]);
                        }
                    };

                    this.fileController.feedbackData.ajaxAddNegativeFeedback(this.seq, this.fileID, $.proxy(negativeFeedbackContext.onSuccess, negativeFeedbackContext), $.proxy(negativeFeedbackContext.onError, negativeFeedbackContext));
                }
            }
        };

        bootbox.confirm("Sei sicuro di voler rimuovere il tag suggerito? (Feedback negativo)", $.proxy(confirmContext.confirm, confirmContext));
    }

    treeView_onButtonClick(e, dir) {
        if (dir.newFolder !== undefined) {//nuova cartella
            //Richiedo nome.
            var promptContext = {
                fileController: this.fileController,
                prompt: function (result) {

                    var context = {
                        fileController: this.fileController,
                        onSuccess: function (info) {//Aggiorno view.
                            this.fileController.viewFileView();
                        },
                        onError: function (info) {
                            this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile aggiungere cartella", 2]);
                        }
                    };

                    //Regex nuovo nome (result)?
                    var name = result;

                    if (name !== "" && name !== null) {
                        //teoricamente la maindir presente in treeData corrisponde. Ma non siamo certi asd.
                        this.fileController.treeData.setMainDir(this.fileController.context.mainDir);
                        this.fileController.treeData.ajaxMkDir(name, $.proxy(context.onSuccess, context), $.proxy(context.onError, context));
                    }
                }
            };

            bootbox.prompt("Inserisci il nome della nuova cartella:", $.proxy(promptContext.prompt, promptContext));
        } else if (dir.upperDir !== undefined) {
            //Ricavo la cartella superiore e faccio il refresh.
            var treeDataGetUpperDirContext = {
                fileController: this.fileController,
                onSuccess: function (response) {//Imposto la mainDir
                    this.fileController.context.mainDir = this.fileController.treeData.mainDir;
                    this.fileController.treeView.clearLsDir();
                    this.fileController.viewFileView();
                },
                onError: function (response) {
                    this.fileController.trigger("Interface_onLog", ["Info", "Raggiunta la root"]);
                }
            };

            this.fileController.treeData.ajaxGetUpperDir($.proxy(treeDataGetUpperDirContext.onSuccess, treeDataGetUpperDirContext), $.proxy(treeDataGetUpperDirContext.onError, treeDataGetUpperDirContext));
        } else {
            //Visualizzazione normale.
            this.fileController.context.mainDir = dir;
            this.fileController.viewFileView();
        }
    }

    fileView_onButtonClick(event, clickEvent, $button, fileID) {//Click su file
        //Passo l' hash del file desiderato al metodo
        this.fileController.context.fileID = parseInt(fileID);
        this.fileController.viewFileInfoView();

        //Throws livelli superiori... (Aggiornamento opzioni reti neurali etc)
        //this.fileController.trigger("FileController_buttonClick", [index, $button, fileHash, this.fileController]);
    }

    fileView_onFileBlockClick(event, clickEvent, $fileBlock, fileID) {
        //Verifico che non si stia premendo il pulsantino info.
        var $target = $(clickEvent.target);
        if (!$target.hasClass("fileBlockButton")) {
            //Toggle File selection
            this.fileController.fileSelection.toggleSelection(fileID);

            if (!$fileBlock.hasClass("selected")) {
                $fileBlock.addClass("selected");
            } else {
                $fileBlock.removeClass("selected");
            }

            //Attivazione disattivazione opzioni
            if (!this.fileController.fileSelection.isEmpty()) {
                this.fileController.filesOptionsView.disableOnly([3]);
            } else {
                this.fileController.filesOptionsView.enableOnly([5]);
            }

            //Throws livelli superiori... (Aggiornamento opzioni reti neurali etc)
            //this.fileController.trigger("FileController_fileBlockClick", [index, $fileBlock, fileHash, this.fileController]);
        }
    }

    fileInfoView_onViewButtonClick(event, $button, fileID, form) {
        form.submit();
    }

    fileInfoView_onDownloadButtonClick(event, $button, fileID, form) {
        form.submit();
    }

    fileTagsView_onTagButtonClick(event, index, $button, tagID) {
        //Filtro!           
        switch (this.fileController.context.currentView) {
            case 0:
            {
                this.fileController.tagSelection.toggleSelection(tagID);

                if (!$button.hasClass("btn-primary")) {
                    $button.removeClass("btn-default");
                    $button.addClass("btn-primary");
                } else {
                    $button.addClass("btn-default");
                    $button.removeClass("btn-primary");
                }

                var fileDataContext = {
                    fileController: this.fileController,
                    onSuccess: function (response) {
                        this.fileController.fileView.setLsFile(this.fileController.fileData.lsFile);
                        this.fileController.fileView.updateView();
                    },
                    onError: function (response) {
                        this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                        this.fileController.fileView.setLsFile(this.fileController.fileData.lsFile);
                        this.fileController.fileView.updateView();
                    }
                };

                this.fileController.fileData.setDirID(parseInt(this.fileController.context.mainDir.dirID));
                this.fileController.fileData.setTagsID(this.fileController.tagSelection.selectedTagID);

                if (!this.fileController.tagSelection.isEmpty()) {
                    this.fileController.fileData.ajaxFilteredLsFile($.proxy(fileDataContext.onSuccess, fileDataContext), $.proxy(fileDataContext.onError, fileDataContext));
                } else {
                    this.fileController.fileData.ajaxLsFile($.proxy(fileDataContext.onSuccess, fileDataContext), $.proxy(fileDataContext.onError, fileDataContext));
                }

                break;
            }
            case 1:
            {
                this.fileController.trigger("FileController_FileTagClick", [this.fileController.context.currentView, this.fileController.context.fileID, this.fileController.tagsData.tags[index]]);
                break;
            }
            default:
        }
    }

    fileTagsView_onDelTagButtonClick(event, index, $button) {
        var removeFileTagLinkContext = {
            fileController: this.fileController,
            tagIndex: index,
            callback: function (result) {
                if (result) {
                    var tagID = parseInt(this.fileController.tagsData.tags[index]["tagID"]);
                    var fileID = parseInt(this.fileController.context.fileID);

                    var contextUpdate = {
                        fileController: this.fileController,
                        onSuccess: function (response) {
                            //Sarebbe meglio sostituire con solo aggiornamento dei tag.
                            this.fileController.viewFileInfoView();
                        },
                        onError: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile rimuovere il file tag link (" + response.code + ")", 2]);
                        }
                    };

                    this.fileController.tagsData.ajaxRemoveFileTagLink(tagID, fileID, $.proxy(contextUpdate.onSuccess, contextUpdate), $.proxy(contextUpdate.onError, contextUpdate));
                }
            }
        };

        bootbox.confirm("Sei sicuro di voler cancellare il link tag file?", $.proxy(removeFileTagLinkContext.callback, removeFileTagLinkContext));
    }

    fileTagsView_onButtonLinkFileTagClick(e, $button) {
        if (this.fileController.context.currentView === 1) {
            var fileID = parseInt(this.fileController.context.fileID);
            //Devo ricavare tagID.
            var context = {
                fileController: this.fileController,
                fileID: fileID,
                callback: function (result) {
                    if (result) {
                        var $body = FileController.getBootboxDialog().find(".bootbox-body");
                        var $option = $body.find(".bootboxTagIDSelect option:selected");
                        var tagID = $option.val();

                        var addFileTagLinkContext = {
                            fileController: this.fileController,
                            onSuccess: function (response) {
                                //Sarebbe meglio sostituire con solo aggiornamento dei tag.
                                this.fileController.viewFileInfoView();
                            },
                            onError: function (response) {
                                this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile collegare il file con il tag (" + response.code + ")", 2]);
                            }
                        };

                        this.fileController.tagsData.ajaxAddFileTagLink(tagID, this.fileID, $.proxy(addFileTagLinkContext.onSuccess, context), $.proxy(addFileTagLinkContext.onError, context));
                    }
                },
                init: function () {
                    //Ricavo i tags
                    var getTagsContext = {
                        fileController: this.fileController,
                        onSuccess: function (response) {
                            this.fileController.bootboxLinkTagFileDialog.setTags(this.fileController.tagsData.tags);
                            FileController.getBootboxDialog().find('.bootbox-body').html(this.fileController.bootboxLinkTagFileDialog.toHTML);
                        },
                        onError: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Info", "Nessun tag disponibile (" + response.code + ")", -1]);
                        }
                    };

                    this.fileController.tagsData.ajaxGetTags($.proxy(getTagsContext.onSuccess, getTagsContext), $.proxy(getTagsContext.onError, getTagsContext));
                }
            };

            FileController.setBootboxDialog(bootbox.confirm({
                title: "Crea nuovo tag",
                message: this.fileController.bootboxLinkTagFileDialog.loadingHTML,
                callback: $.proxy(context.callback, context)
            }));

            FileController.getBootboxDialog().init($.proxy(context.init, context));
        }
    }

    fileTagsView_onButtonNewTagClick(e, $button) {
        var context = {
            fileController: this.fileController,
            callback: function (result) {
                if (result) {
                    var $body = FileController.getBootboxDialog().find(".bootbox-body");
                    var $tagName = $body.find(".bootboxTagName");
                    var $tagDesc = $body.find(".bootboxTagDesc");
                    var $tagShareable = $body.find(".bootboxTagShareable");
                    var $option = $body.find(".bootboxTagParentSelect option:selected");


                    var tagName = $tagName.val();
                    //Base 64 encoding.
                    var tagDesc = window.btoa($tagDesc.val());
                    var isTagShareable = $tagShareable.is(":checked");
                    var tagIDParent = $option.val();


                    var createTagContext = {
                        fileController: this.fileController,
                        onSuccess: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Creazione tag:", "Tag creato con successo!", 0]);
                        },
                        onError: function (response) {
                            this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile creare nuovo tag (" + response.code + ")", 2]);
                        }
                    };

                    this.fileController.tagsData.ajaxCreateTag(tagName, tagDesc, isTagShareable, tagIDParent, $.proxy(createTagContext.onSuccess, context), $.proxy(createTagContext.onError, context));
                }
            },
            init: function () {
                //Ricavo i tags
                var getTagsContext = {
                    fileController: this.fileController,
                    onSuccess: function (response) {
                        this.fileController.bootboxNewTagDialog.setTags(this.fileController.tagsData.tags);
                        FileController.getBootboxDialog().find('.bootbox-body').html(this.fileController.bootboxNewTagDialog.toHTML);
                    },
                    onError: function (response) {
                        FileController.getBootboxDialog().find('.bootbox-body').html(this.fileController.bootboxNewTagDialog.toHTML);
                        this.fileController.trigger("Interface_onLog", ["Info", "Nessun tag padre disponibile (" + response.code + ")", -1]);
                    }
                };

                this.fileController.tagsData.ajaxGetTags($.proxy(getTagsContext.onSuccess, getTagsContext), $.proxy(getTagsContext.onError, getTagsContext));
            }
        };

        FileController.setBootboxDialog(bootbox.confirm({
            title: "Crea nuovo tag",
            message: this.fileController.bootboxNewTagDialog.loadingHTML,
            callback: $.proxy(context.callback, context)
        }));

        FileController.getBootboxDialog().init($.proxy(context.init, context));
    }

    fileOptionsView_onButtonClick(event, option, $option) {
        switch (option) {
            case 0://Rinomina
            {
                //Richiedo nuovo nome.

                var promptContext = {
                    fileController: this.fileController,
                    prompt: function (result) {

                        var context = {
                            fileController: this.fileController,
                            onSuccess: function (response) {
                                //Aggiorno view.
                                this.fileController.viewFileInfoView();
                            },
                            onError: function (response) {
                                this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile rinominare il file", 2]);
                            }
                        };

                        //Regex nuovo nome (result)
                        var newName = result;

                        this.fileController.fileOptionsData.rename(newName, parseInt(this.fileController.context.fileID), $.proxy(context.onSuccess, context), $.proxy(context.onError, context));
                    }
                };

                bootbox.prompt("Inserisci il nuovo nome:", $.proxy(promptContext.prompt, promptContext));
                break;
            }
            case 1://Elimina
            {
                var confirmContext = {
                    fileController: this.fileController,
                    confirm: function (result) {
                        if (result) {
                            var context = {
                                fileController: this.fileController,
                                onSuccess: function (response) {
                                    //Passo a file view .
                                    this.fileController.viewFileView();
                                },
                                onError: function (response) {
                                    this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile eliminare il file", 2]);
                                }
                            };
                            this.fileController.fileOptionsData.delete(parseInt(this.fileController.context.fileID), $.proxy(context.onSuccess, context), $.proxy(context.onError, context));
                        }
                    }
                };

                bootbox.confirm("Confermi la cancellazione?", $.proxy(confirmContext.confirm, confirmContext));
                break;
            }
            case 2://cambia info
            {
                var promptContext = {
                    fileController: this.fileController,
                    callback: function (result) {
                        if (result != null) {
                            //Base64 encoding
                            var fileInfo64 = window.btoa(result);

                            var context = {
                                fileController: this.fileController,
                                onSuccess: function (response) {
                                    //Aggiorno view.
                                    this.fileController.viewFileInfoView();
                                },
                                onError: function (response) {
                                    this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile cambiare le informazioni al file", 2]);
                                }
                            };

                            this.fileController.fileOptionsData.ajaxChangeInfo(fileInfo64, parseInt(this.fileController.context.fileID), $.proxy(context.onSuccess, context), $.proxy(context.onError, context));
                        }
                    }
                };

                bootbox.prompt({
                    title: "Cambia le informazioni",
                    inputType: 'textarea',
                    callback: $.proxy(promptContext.callback, promptContext)
                });
                break;
            }
            case 3://Analizza file.
            {
                var contextAnalyze = {
                    fileController: this.fileController,
                    onSuccess: function (response) {
                        this.fileController.viewFileInfoView();
                    },
                    onError: function (response) {
                        this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile analizzare il file", 2]);
                    }
                };

                this.fileController.fileOptionsData.ajaxAnalyzeFile(parseInt(this.fileController.context.fileID), $.proxy(contextAnalyze.onSuccess, contextAnalyze), $.proxy(contextAnalyze.onError, contextAnalyze));
                break;
            }
            case 5://Exit
            {
                this.fileController.viewFileView();
                break;
            }
        }
    }

    filesOptionsView_onButtonClick(event, option, $option) {
        switch (option) {
            case 0://Annulla
            {
                //Ripristino selezione
                this.fileController.fileSelection.undoSelection();
                //Abilito solo pulsante update
                this.fileController.filesOptionsView.enableOnly([5]);
                //Ripristino file view.
                this.fileController.viewFileView();
                break;
            }
            case 1://Taglia
            {
                //Disabilito selezione.
                this.fileController.fileSelection.disableSelection();
                //Disabilito il tasto copia
                this.fileController.filesOptionsView.disableOnly([1, 2]);
                //Imposto lo stato di selezione.
                this.fileController.fileSelection.setSelectionState(1);
                break;
            }
            case 2://Copia
            {
                //Disabilito selezione.
                this.fileController.fileSelection.disableSelection();
                //Disabilito il tasto taglia
                this.fileController.filesOptionsView.disableOnly([1, 2]);
                //Imposto lo stato di selezione.
                this.fileController.fileSelection.setSelectionState(2);
                break;
            }
            case 3://Incolla
            {

                switch (this.fileController.fileSelection.selectionState) {
                    case 1://Taglia
                    {
                        var cutContext = {
                            fileController: this.fileController,
                            onSuccess: function (info) {
                                this.fileController.viewFileView();
                            },
                            onError: function (info) {
                                this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile spostare i file", 2]);
                            }
                        };

                        //Ricavo la cartella di destinazione.
                        var destDirID = parseInt(this.fileController.context.mainDir.dirID);
                        //Ricavo gli hash dei file da spostare.
                        var cutFilesHashes = this.fileController.fileSelection.selectedFileID;

                        this.fileController.filesOptionsData.cut(cutFilesHashes, destDirID, $.proxy(cutContext.onSuccess, cutContext), $.proxy(cutContext.onError, cutContext));
                        break;
                    }
                    case 2://Copia
                    {

                        var copyContext = {
                            fileController: this.fileController,
                            onSuccess: function (info) {
                                this.fileController.viewFileView();
                            },
                            onError: function (info) {
                                this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile copiare i file", 2]);
                            }
                        };

                        //Ricavo la cartella di destinazione.
                        var destDirID = parseInt(this.fileController.context.mainDir.dirID);
                        //Ricavo gli hash dei file da spostare.
                        var copyFilesHashes = this.fileController.fileSelection.selectedFileID;

                        this.fileController.filesOptionsData.copy(copyFilesHashes, destDirID, $.proxy(copyContext.onSuccess, copyContext), $.proxy(copyContext.onError, copyContext));
                        break;
                    }
                }

                //Ripristino selezione
                this.fileController.fileSelection.undoSelection();
                this.fileController.filesOptionsView.enableOnly([5]);
                break;
            }
            case 4://Elimina
            {
                var delContext = {
                    fileController: this.fileController,
                    onSuccess: function (info) {
                        this.fileController.viewFileView();
                    },
                    onError: function (info) {
                        this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile eliminare i file", 2]);
                    }
                };

                //Ricavo gli hash dei file da eliminare.
                var delFileHashes = this.fileController.fileSelection.selectedFileID;

                this.fileController.filesOptionsData.delete(delFileHashes, $.proxy(delContext.onSuccess, delContext), $.proxy(delContext.onError, delContext));

                //Ripristino selezione.
                this.fileController.fileSelection.undoSelection();
                this.fileController.filesOptionsView.enableOnly([5]);
                break;
            }
            case 5://Upload
            {
                this.fileController.viewFileUploadView();
                break;
            }
            default: //Opzione non dichiarata
                break;
        }
    }

    editorImageOptionView_onButtonClick(e, index, $button) {
        switch (index) {
            case 0://Consegno i dati elaborati.
            {
                var context = {
                    fileController: this.fileController,
                    onSuccess: function (response) {
                        this.fileController.trigger("Interface_onLog", ["Successo!", "Dataset creato con successo", 0]);
                    },
                    onError: function (response) {
                        this.fileController.trigger("Interface_onLog", ["Errore", "Impossibile creare il dataset (" + response.code + ")", 2]);
                    }
                };

                var points = this.fileController.editorImageView.points;
                var scale = this.fileController.editorImageView.imageParam.scale;
                var image64 = this.fileController.editorImageView.crop();

                this.fileController.editorImageData.setImage(image64);
                this.fileController.editorImageData.setPoints(points, scale);
                this.fileController.editorImageData.setPresetID(parseInt(this.fileController.context.editor.presetID));

                if (parseInt(this.fileController.context.editor.datasetID) === -1 && parseInt(this.fileController.context.editor.presetID) > 0) {
                    this.fileController.editorImageData.setTagID(this.fileController.context.editor.tagID);
                    this.fileController.editorImageData.setFileID(parseInt(this.fileController.context.fileID));
                    this.fileController.editorImageData.ajaxCreateDataset($.proxy(context.onSuccess, context), $.proxy(context.onError, context));
                }

                this.fileController.viewFileInfoView();

                break;
            }
            case 1://Pulisco la selezione.
            {
                this.fileController.editorImageView.clear();
                break;
            }
            case 2://Selezione del preset.
            {
                var context = {
                    fileController: this.fileController,
                    callback: function (result) {
                        if (result) {
                            var $body = FileController.getBootboxDialog().find(".bootbox-body");
                            var $option = $body.find(".bootboxPresetIDSelect option:selected");
                            var presetID = $option.val();
                            this.fileController.context.editor.presetID = 1 * presetID;
                            this.fileController.editorImageOptionsView.presetSelected();
                        }
                    },
                    init: function () {
                        //Ricavo i tags
                        var getPresetsContext = {
                            fileController: this.fileController,
                            onSuccess: function (response) {
                                this.fileController.bootboxSelectPresetDialog.setPresets(this.fileController.editorImageData.presets);
                                this.fileController.bootboxSelectPresetDialog.updateDialog();

                                var $body = FileController.getBootboxDialog().find('.bootbox-body');
                                $body.html(this.fileController.bootboxSelectPresetDialog.toHTML);

                                this.fileController.bootboxSelectPresetDynamicView = new BootboxSelectPresetDynamicView($body);
                                this.fileController.bootboxSelectPresetDynamicView.setPresets(this.fileController.editorImageData.presets);

                                var dynamicPresetsContext = {
                                    fileController: this.fileController,
                                    $body: $body,
                                    change: function (e) {
                                        this.$body.find(".bootboxPresetIDSelect option:selected");
                                        var $option = $body.find(".bootboxPresetIDSelect option:selected");
                                        var presetID = parseInt($option.val());
                                        this.fileController.bootboxSelectPresetDynamicView.setPresetID(presetID);
                                        this.fileController.bootboxSelectPresetDynamicView.updateView();
                                    }
                                };

                                $body.change($.proxy(dynamicPresetsContext.change, dynamicPresetsContext));

                            },
                            onError: function (response) {
                                FileController.getBootboxDialog().find('.bootbox-body').html(this.fileController.bootboxSelectPresetDialog.toHTML);
                                this.fileController.trigger("Interface_onLog", ["Info", "Nessun preset disponibile (" + response.code + ")", -1]);
                            }
                        };

                        this.fileController.editorImageData.ajaxGetPresets($.proxy(getPresetsContext.onSuccess, getPresetsContext), $.proxy(getPresetsContext.onError, getPresetsContext));
                    }
                };

                FileController.setBootboxDialog(bootbox.confirm({
                    title: "Seleziona preset",
                    message: this.fileController.bootboxSelectPresetDialog.loadingHTML,
                    callback: $.proxy(context.callback, context)
                }));

                FileController.getBootboxDialog().init($.proxy(context.init, context));
                break;
            }
            case 5://exit! - ripristino file info view.
            {
                this.fileController.viewFileInfoView();
                break;
            }
        }
    }

    fileUploadOptionsView_onButtonClick(event, index, $button) {
        switch (index) {
            case 0:
            {
                this.fileController.dropzone.enqueueFiles(this.fileController.dropzone.getFilesWithStatus(Dropzone.ADDED));
                break;
            }
            case 1:
            {
                //this.fileController.dropzone.removeAllFiles(true);
                break;
            }
            case 5:
            {
                //Ripristino file View.
                this.fileController.viewFileView();
                break;
            }
        }
    }

    //Callback interfacce
    neuralController_onEditorClick(e, fileMIME, fileID, tagID, datasetID) {
        if (this.fileController.context.currentView === 1) {
            this.fileController.context.editor.datasetID = parseInt(datasetID);
            this.fileController.context.editor.tagID = parseInt(tagID);

            switch (fileMIME) {
                case "image/jpg":
                case "image/jpeg":
                case "image/png":
                {
                    this.fileController.viewEditorImageView();
                    break;
                }
                default:
            }
        }
    }

    footerController_onLoginSuccessful(e, accountInfo) {
        //L' utente ha effettuato l' accesso
        this.fileController.viewFileView();
    }

    footerController_onLogoutSuccessful(e) {
        this.fileController.context.mainDir.dirID = 0;
        this.fileController.context.mainDir.dirName = "Root";
        this.fileController.context.fileID = 0;
        this.fileController.hideAll();
    }

    footerController_onAccountStatus(e, accountInfo) {
        if (accountInfo.isLogged) {
            //L' utente ha effettuato l' accesso
            this.fileController.viewFileView();
        }
    }

    dropzone_onAddedFile(file) {
        var subContext = {
            fileController: this.fileController,
            file: file,
            start: function (e) {
                this.fileController.dropzone.enqueueFile(this.file);
            },
            remove: function (e) {
                this.fileController.dropzone.removeFile(this.file);
            }
        };

        $(file.previewElement).find(".dropzone-startuploadbutton").click($.proxy(subContext.start, subContext));
        $(file.previewElement).find(".dropzone-removebutton").click($.proxy(subContext.remove, subContext));
    }

    dropzone_onError(file, errorMessage) {
        $(file.previewElement).find(".dropzone-alerterror").css("display", "block");
    }

    dropzone_onSending(file, xhr, formData) {
        $(file.previewElement).find(".dropzone-startuploadbutton").addClass("disabled");
        $(file.previewElement).find(".dropzone-removebutton").addClass("disabled");

        for (var key in this.fileController.dropzoneData.data) {
            formData.append(key, this.fileController.dropzoneData.data[key]);
        }
        formData.append("thumbnail", file.thumbnail);
    }

    dropzone_onUploadProgress(file, percentage, bytesSent) {
        $(file.previewElement).find(".dropzone-progresslabel").text(parseInt(bytesSent / 1024) + " KB (" + parseInt(percentage, 10) + " %)");
        $(file.previewElement).find(".dropzone-progressbar").css("width", percentage + "%");
    }

    dropzone_onThumbnail(file, thumb) {
        file.thumbnail = thumb;
    }

    editorImageViewCanvas_onMousedown(e) {
        this.fileController.editorImageView.mousedown(e);
    }

    editorImageViewCanvas_onMousemove(e) {
        this.fileController.editorImageView.mousemove(e);
    }

    editorImageViewCanvas_onMouseleave(e) {
        this.fileController.editorImageView.mouseleave(e);
    }

    editorImageViewCanvas_onMouseup(e) {
        this.fileController.editorImageView.mouseup(e);
    }

    //Metodi normali------------------------------------------------------------
    toggleView(index) {
        switch (index) {
            case - 1:
            case 0:
            case 1:
            case 2:
            case 3:
                this.context.currentView = index;
                this.trigger("FileController_toggleView", [this, index]);
                break;
            default:
        }
        switch (index) {
            case -1://Nulla
            {
                this.treeView.hide();
                this.fileView.hide();
                this.fileInfoView.hide();
                this.fileUploadView.hide();
                this.editorImageView.hide();
                this.fileTagsView.hide();
                this.fileSuggestedTagsView.hide();

                this.filesOptionsView.hide();
                this.fileOptionsView.hide();
                this.fileUploadOptionsView.hide();
                this.editorImageOptionsView.hide();

                this.fileTagsView.setFileTagLinkEnabled(false);
                break;
            }
            case 0://fileView
            {
                this.treeView.show();
                this.fileView.show();
                this.fileInfoView.hide();
                this.fileUploadView.hide();
                this.editorImageView.hide();
                this.fileTagsView.show();
                this.fileSuggestedTagsView.hide();

                this.filesOptionsView.show();
                this.fileOptionsView.hide();
                this.fileUploadOptionsView.hide();
                this.editorImageOptionsView.hide();

                this.fileTagsView.setFileTagLinkEnabled(false);
                break;
            }
            case 1://fileInfoView
            {
                this.treeView.hide();
                this.fileView.hide();
                this.fileInfoView.show();
                this.fileUploadView.hide();
                this.editorImageView.hide();
                this.fileTagsView.show();
                this.fileSuggestedTagsView.show();

                this.filesOptionsView.hide();
                this.fileOptionsView.show();
                this.fileUploadOptionsView.hide();
                this.editorImageOptionsView.hide();

                this.fileTagsView.setFileTagLinkEnabled(true);
                break;
            }
            case 2://fileUploadView
            {
                this.treeView.hide();
                this.fileView.hide();
                this.fileInfoView.hide();
                this.fileUploadView.show();
                this.editorImageView.hide();
                this.fileTagsView.hide();
                this.fileSuggestedTagsView.hide();

                this.filesOptionsView.hide();
                this.fileOptionsView.hide();
                this.fileUploadOptionsView.show();
                this.editorImageOptionsView.hide();

                this.fileTagsView.setFileTagLinkEnabled(false);
                break;
            }
            case 3://editorImageView
            {
                this.treeView.hide();
                this.fileView.hide();
                this.fileInfoView.hide();
                this.fileUploadView.hide();
                this.editorImageView.show();
                this.fileTagsView.hide();
                this.fileSuggestedTagsView.hide();

                this.filesOptionsView.hide();
                this.fileOptionsView.hide();
                this.fileUploadOptionsView.hide();
                this.editorImageOptionsView.show();

                this.editorImageOptionsView.presetDelesected();

                this.fileTagsView.setFileTagLinkEnabled(false);
                break;
            }
        }
    }

    hideAll() {
        this.toggleView(-1);
    }

    initFileView() {
        //Aggiorno le opzioni
        this.filesOptionsView.updateView();
    }

    viewFileView() {
        this.toggleView(0);

        //Verifico se abbiamo bisogno dell' hash root dir.
        if (parseInt(this.context.mainDir.dirID) === 0) {
            var treeDataGetRootContext = {
                fileController: this,
                onSuccess: function (response) {
                    //Aggiorno l' hash
                    this.fileController.context.mainDir = this.fileController.treeData.mainDir;
                    this.fileController.treeView.clearLsDir();
                    this.fileController.viewFileView();
                },
                onError: function (response) {
                    this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                }
            };

            this.treeData.ajaxGetRoot($.proxy(treeDataGetRootContext.onSuccess, treeDataGetRootContext), $.proxy(treeDataGetRootContext.onError, treeDataGetRootContext));

            //Effettuo il return per poter far aggiornare il context in tempo!
            return;
        } else {
            var treeDataLsDirContext = {
                fileController: this,
                onSuccess: function (response) {
                    this.fileController.treeView.setMainDir(this.fileController.treeData.mainDir);
                    this.fileController.treeView.setLsDir(this.fileController.treeData.lsDir);
                    this.fileController.treeView.updateView();
                },
                onError: function (response) {
                    if (response.code === 2) {
                        //Posso inizializzare le funzioni del tree.
                        this.fileController.treeView.setMainDir(this.fileController.treeData.mainDir);
                        this.fileController.treeView.clearLsDir();
                        this.fileController.treeView.updateView();
                    }
                    this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                }
            };

            this.treeData.setMainDir(this.context.mainDir);
            this.treeData.ajaxLsDir($.proxy(treeDataLsDirContext.onSuccess, treeDataLsDirContext), $.proxy(treeDataLsDirContext.onError, treeDataLsDirContext));
        }

        var fileDataContext = {
            fileController: this,
            onSuccess: function (response) {
                this.fileController.fileView.setLsFile(this.fileController.fileData.lsFile);
                this.fileController.fileView.updateView();
            },
            onError: function (response) {
                this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                this.fileController.fileView.setLsFile(this.fileController.fileData.lsFile);
                this.fileController.fileView.updateView();
            }
        };

        this.fileData.setDirID(parseInt(this.context.mainDir.dirID));
        this.fileData.ajaxLsFile($.proxy(fileDataContext.onSuccess, fileDataContext), $.proxy(fileDataContext.onError, fileDataContext));

        var tagsDataTagsContext = {
            fileController: this,
            onSuccess: function (response) {
                this.fileController.fileTagsView.setTags(this.fileController.tagsData.tags);
                this.fileController.fileTagsView.updateView();
            },
            onError: function (response) {
                this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                if (response.code === 2) {
                    this.fileController.fileTagsView.setTags(this.fileController.tagsData.tags);
                    this.fileController.fileTagsView.updateView();
                }
            }
        };

        this.tagsData.setDirID(parseInt(this.context.mainDir.dirID));
        this.tagsData.ajaxGetDirTags($.proxy(tagsDataTagsContext.onSuccess, tagsDataTagsContext), $.proxy(tagsDataTagsContext.onError, tagsDataTagsContext));
    }

    initFileInfoView() {
        //Aggiorno le opzioni
        this.fileOptionsView.updateView();
    }

    viewFileInfoView() {

        //Reset selezione
        this.fileSelection.undoSelection();
        this.filesOptionsView.enableOnly([5]);

        //Sostituzione fileView con fileInfoView.
        this.toggleView(1);

        var fileInfoDataFileInfoContext = {
            fileController: this,
            onSuccess: function (response) {
                this.fileController.fileInfoView.setFileInfo(this.fileController.fileInfoData.fileInfo);
                this.fileController.fileInfoView.updateView();
            },
            onError: function (response) {
                this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
            }
        };

        this.fileInfoData.setFileID(parseInt(this.context.fileID));
        this.fileInfoData.ajaxFileInfo($.proxy(fileInfoDataFileInfoContext.onSuccess, fileInfoDataFileInfoContext), $.proxy(fileInfoDataFileInfoContext.onError, fileInfoDataFileInfoContext));

        //Visualizzo i tag del file.

        var tagsDataFileTagsContext = {
            fileController: this,
            onSuccess: function () {
                this.fileController.fileTagsView.setTags(this.fileController.tagsData.tags);
                this.fileController.fileTagsView.updateView();
            },
            onError: function (response) {
                this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                if (response.code === 2) {
                    this.fileController.fileTagsView.setTags(this.fileController.tagsData.tags);
                    this.fileController.fileTagsView.updateView();
                }
            }
        };

        this.tagsData.setFileID(parseInt(this.context.fileID));
        this.tagsData.ajaxGetFileTags($.proxy(tagsDataFileTagsContext.onSuccess, tagsDataFileTagsContext), $.proxy(tagsDataFileTagsContext.onError, tagsDataFileTagsContext));


        var suggestedTagsContext = {
            fileController: this,
            onSuccess: function () {
                this.fileController.fileSuggestedTagsView.setSuggestedTags(this.fileController.fileSuggestedTagsData.suggestedTags);
                this.fileController.fileSuggestedTagsView.updateView();
            },
            onError: function (response) {
                this.fileController.trigger("Interface_onLog", ["Attenzione!", response.errorMessage, 1]);
                if (response.code === 2) {
                    this.fileController.fileSuggestedTagsView.setSuggestedTags(this.fileController.fileSuggestedTagsData.suggestedTags);
                    this.fileController.fileSuggestedTagsView.updateView();
                }
            }
        };

        this.fileSuggestedTagsData.ajaxGetSuggestedTags(parseInt(this.context.fileID), $.proxy(suggestedTagsContext.onSuccess, suggestedTagsContext), $.proxy(suggestedTagsContext.onError, suggestedTagsContext));
    }

    initFileUploadView() {
        //Aggiorno le opzioni
        this.fileUploadOptionsView.updateView();
    }

    viewFileUploadView() {
        //Aggiorno la cartella per l' upload in dropzone
        this.dropzoneData.setDirID(parseInt(this.context.mainDir.dirID));

        //Reset selezione
        this.fileSelection.undoSelection();
        this.filesOptionsView.enableOnly([5]);

        //Sostituzione fileView con fileUploadView.
        this.toggleView(2);

        //Rimuovo tutti i file presenti in dropzone.
        this.dropzone.removeAllFiles(true);
    }

    initEditorImageView() {
        //Aggiorno le opzioni
        this.editorImageOptionsView.updateView();
    }

    viewEditorImageView() {
        this.toggleView(3);
        //aggiorno view
        this.editorImageView.updateView();
        //aggiungo i bind
        this.bindEditorImageCanvas();
        //Aggiorno immagine
        var url = "php/download.php?fileID=" + parseInt(this.context.fileID);
        this.editorImageView.setImage({
            src: url
        });
    }

    bindEditorImageCanvas() {
        this.editorImageView.$canvas.on("mousedown", $.proxy(this.editorImageViewCanvasContext.onMousedown, this.editorImageViewCanvasContext));
        this.editorImageView.$canvas.on("mousemove", $.proxy(this.editorImageViewCanvasContext.onMousemove, this.editorImageViewCanvasContext));
        this.editorImageView.$canvas.on("mouseleave", $.proxy(this.editorImageViewCanvasContext.onMouseleave, this.editorImageViewCanvasContext));
        this.editorImageView.$canvas.on("mouseup", $.proxy(this.editorImageViewCanvasContext.onMouseup, this.editorImageViewCanvasContext));
    }
}