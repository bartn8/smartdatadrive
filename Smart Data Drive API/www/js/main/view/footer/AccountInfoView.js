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

class AccountInfoView extends View {

    constructor($this) {
        super($this);
        this.accountInfo = {
            isLogged: false
        };
    }

    updateView() {
        this.$this.empty();

        var $row = $("<div class=\"row\"><div class=\"media\"><div class=\"media-left media-middle\"><img src=\"\" class=\"accountImage img-circle media-object\" alt=\"Immagine profilo\"></div><div class=\"media-body media-middle\"><div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-4\"><h5 class=\"accountName media-heading\"></h5><p class=\"accountEmail\"></p></div><div class=\"col-md-8\"><div class=\"btn-group\"><button class=\"accountLogin btn btn-primary\">Login</button><button class=\"accountLogout btn btn-primary\">Logout</button><button class=\"accountRegistration btn btn-primary\">Registrati</button></div></div></div></div></div></div></div>");

        var $accountImage = $row.find(".accountImage");
        var $accountName = $row.find(".accountName");
        var $accountEmail = $row.find(".accountEmail");
        var $accountLogin = $row.find(".accountLogin");
        var $accountLogout = $row.find(".accountLogout");
        var $accountRegistration = $row.find(".accountRegistration");


        if (this.accountInfo.isLogged) {
            $accountImage.attr("src", "./images/default/profile.jpg");
            $accountName.text(this.accountInfo.nome + " " + this.accountInfo.cognome);
            $accountEmail.text(this.accountInfo.email);
            $accountLogin.addClass("disabled");
            $accountRegistration.addClass("disabled");
        } else {
            $accountImage.attr("src", "./images/default/profile.jpg");
            $accountName.text("Guest");
            $accountEmail.text("no email");
            $accountLogout.addClass("disabled");
        }

        var buttonContext = {
            context: this,
            onLoginClick: function (e) {
                this.context.$this.trigger("AccountInfoView_LoginClick", []);
            },
            onLogoutClick: function (e) {
                this.context.$this.trigger("AccountInfoView_LogoutClick", []);
            },
            onRegistrationClick: function (e) {
                this.context.$this.trigger("AccountInfoView_RegistrationClick", []);
            }
        };

        $accountLogin.click($.proxy(buttonContext.onLoginClick, buttonContext));
        $accountLogout.click($.proxy(buttonContext.onLogoutClick, buttonContext));
        $accountRegistration.click($.proxy(buttonContext.onRegistrationClick, buttonContext));

        this.$this.append($row);
    }

    setAccountInfo(info) {
        this.accountInfo = info;
    }
}