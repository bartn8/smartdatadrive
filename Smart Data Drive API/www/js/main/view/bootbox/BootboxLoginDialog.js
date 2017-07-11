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
class BootboxLoginDialog {
    constructor() {
        this.$container = $("<div></div>");
        this.$container.append("<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label>Username</label><input type=\"text\" class=\"form-control bootboxUsername\"></div><div class=\"form-group\"><label>Password</label><input type=\"password\" class=\"form-control bootboxPassword\"></div></div></div></div>");
    }

    get toHTML() {
        return this.$container.html();
    }
}