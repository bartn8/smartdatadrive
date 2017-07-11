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


/* global bootbox */

class FooterController extends Controller {

    static getBootboxDialog() {
        return this.bootboxDialog;
    }

    static setBootboxDialog(dialog) {
        this.bootboxDialog = dialog;
    }

    constructor($interface, $accountInfoView) {
        super($interface);

        //Views
        this.accountInfoView = new AccountInfoView($accountInfoView);
        //Views - BOOTBOX
        this.bootboxLoginDialog = new BootboxLoginDialog();
        this.bootboxRegistrationDialog = new BootboxRegistrationDialog();

        //Models
        this.accountData = new AccountData();

        //Context della classe
        this.context = {
            currentView: 0
        };

        //Context di callback delle view
        this.accountInfoViewContext = new Object();

        //Context di callback dell' interfaccia
        this.interfaceContext = new Object();
    }

    init() {

        this.initAccountInfoView();

        this.accountInfoViewContext["footerController"] = this;
        this.accountInfoViewContext["onLoginButtonClick"] = this.accountInfoView_onLoginButtonClick;
        this.accountInfoViewContext["onLogoutButtonClick"] = this.accountInfoView_onLogoutButtonClick;
        this.accountInfoViewContext["onRegistrationButtonClick"] = this.accountInfoView_onRegistrationButtonClick;

        this.accountInfoView.$this.on("AccountInfoView_LoginClick", $.proxy(this.accountInfoViewContext.onLoginButtonClick, this.accountInfoViewContext));
        this.accountInfoView.$this.on("AccountInfoView_LogoutClick", $.proxy(this.accountInfoViewContext.onLogoutButtonClick, this.accountInfoViewContext));
        this.accountInfoView.$this.on("AccountInfoView_RegistrationClick", $.proxy(this.accountInfoViewContext.onRegistrationButtonClick, this.accountInfoViewContext));

        this.interfaceContext["footerController"] = this;
    }

    accountInfoView_onLoginButtonClick(e) {
        var context = {
            footerController: this.footerController,
            callback: function (result) {
                if (result) {
                    var $body = FooterController.getBootboxDialog().find(".bootbox-body");
                    var username = $body.find(".bootboxUsername").val();
                    var password = $body.find(".bootboxPassword").val();

                    var loginContext = {
                        footerController: this.footerController,
                        onSuccess: function (response) {
                            //Informo i colleghi
                            this.footerController.trigger("FooterController_loginSuccessful", [this.footerController.accountData.accountInfo]);

                            this.footerController.accountInfoView.setAccountInfo(this.footerController.accountData.accountInfo);
                            this.footerController.accountInfoView.updateView();
                        },
                        onError: function (response) {
                            this.footerController.trigger("Interface_onLog", ["Errore", "Impossibile loggare", 2]);
                        }
                    };

                    this.footerController.accountData.ajaxLogin(username, password, $.proxy(loginContext.onSuccess, loginContext), $.proxy(loginContext.onError, loginContext));
                }
            }
        };

        FooterController.setBootboxDialog(bootbox.confirm({
            title: "Login",
            message: this.footerController.bootboxLoginDialog.toHTML,
            callback: $.proxy(context.callback, context)
        }));
    }

    accountInfoView_onLogoutButtonClick(e) {
        var logoutContext = {
            context: this.footerController,
            onSuccess: function (response) {
                //Informo i colleghi
                this.context.trigger("FooterController_logoutSuccessful", []);

                this.context.accountInfoView.setAccountInfo(this.context.accountData.accountInfo);
                this.context.accountInfoView.updateView();
            },
            onError: function (response) {
                this.footerController.trigger("Interface_onLog", ["Errore", "Impossibile loggare (" + response.code + ")", 2]);
            }
        };

        this.footerController.accountData.ajaxLogout($.proxy(logoutContext.onSuccess, logoutContext), $.proxy(logoutContext.onError, logoutContext));
    }

    accountInfoView_onRegistrationButtonClick() {
        var context = {
            footerController: this.footerController,
            callback: function (result) {
                if (result) {
                    var $body = FooterController.getBootboxDialog().find(".bootbox-body");
                    var nome = $body.find(".bootboxNome").val();
                    var cognome = $body.find(".bootboxCognome").val();
                    var nickname = $body.find(".bootboxNickname").val();
                    var email = $body.find(".bootboxEmail").val();
                    var username = $body.find(".bootboxUsername").val();
                    var password = $body.find(".bootboxPassword").val();
                    var driveNome = $body.find(".bootboxDriveNome").val();

                    var registrationContext = {
                        footerController: this.footerController,
                        onSuccess: function (response) {
                            this.footerController.trigger("Interface_onLog", ["Successo", "Registrazione effettuata", 0]);
                        },
                        onError: function (response) {
                            this.footerController.trigger("Interface_onLog", ["Errore", "Impossibile registrarsi (" + response.code + ")", 2]);
                        }
                    };

                    this.footerController.accountData.ajaxRegistration(nome, cognome, nickname, email, username, password, driveNome, $.proxy(registrationContext.onSuccess, registrationContext), $.proxy(registrationContext.onError, registrationContext));
                }
            }
        };

        FooterController.setBootboxDialog(bootbox.confirm({
            title: "Registrazione",
            message: this.footerController.bootboxRegistrationDialog.toHTML,
            callback: $.proxy(context.callback, context)
        }));
    }

    toggleView(index) {
        switch (index) {
            case - 1:
            case 0:
                this.context.currentView = index;
                break;
            default:
        }
        switch (index) {
            case -1:
            {
                this.accountInfoView.hide();
                break;
            }
            case 0:
            {
                this.accountInfoView.show();
                break;
            }
        }
    }

    hideAll() {
        this.toggleView(-1);
    }

    initAccountInfoView() {
        var contextUpdate = {
            footerController: this,
            onSuccess: function (response) {
                //Informo i colleghi.
                this.footerController.trigger("FooterController_accountStatus", [this.footerController.accountData.accountInfo]);

                this.footerController.accountInfoView.setAccountInfo(this.footerController.accountData.accountInfo);
                this.footerController.accountInfoView.updateView();
            },
            onError: function (response) {
                this.footerController.trigger("Interface_onLog", ["Errore", response.errorMessage, 2]);
            }
        };

        this.accountData.ajaxAccountStatus($.proxy(contextUpdate.onSuccess, contextUpdate), $.proxy(contextUpdate.onError, contextUpdate));
    }

    viewAccountInfoView() {
        this.toggleView(0);
    }
}