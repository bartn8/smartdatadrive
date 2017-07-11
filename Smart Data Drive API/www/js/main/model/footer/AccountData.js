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

class AccountData {
    constructor() {
        this.url = "php/ajax.php";
        this.accountInfo = {};
    }

    ajaxAccountStatus(onSuccess, onError) {
        var data = {
            command: "accountStatus"
        };

        var context = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: context,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.accountInfo = response.accountInfo;
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxLogin(username, password, onSuccess, onError) {
        var data = {
            command: "login",
            username: username,
            password: password
        };

        var context = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: context,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.accountInfo = response.accountInfo;
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }

    ajaxLogout(onSuccess, onError) {
        var data = {
            command: "logout"
        };

        var context = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: context,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.accountInfo = response.accountInfo;
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }


    ajaxRegistration(nome, cognome, nickname, email, username, password, driveNome, onSuccess, onError) {
        var data = {
            command: "registration",
            nome: nome,
            cognome: cognome,
            nickname: nickname,
            email: email,
            username: username,
            password: password,
            driveNome: driveNome,
        };

        var context = {
            context: this,
            onSuccess: onSuccess,
            onError: onError
        };

        $.ajax({
            type: "POST",
            url: this.url,
            data: data,
            context: context,
            success: function (response) {
                switch (response.code) {
                    case 0:
                        this.context.accountInfo = response.accountInfo;
                        this.onSuccess(response);
                        break;
                    default:
                        this.onError(response);
                        break;
                }
            },
            dataType: "json"
        });
    }
}