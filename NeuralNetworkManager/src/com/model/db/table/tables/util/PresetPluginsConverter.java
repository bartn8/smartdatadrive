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
package com.model.db.table.tables.util;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class PresetPluginsConverter {

    private String encodedString;
    private String[] plugins;

    public PresetPluginsConverter() {
        plugins = new String[0];
        encodedString = "";
    }

    public void setEncodedString(String encodedString) {
        this.encodedString = encodedString;
    }

    public String[] getPlugins() {
        return plugins;
    }

    public void convertEncodedString() {
        plugins = encodedString.split(" ");
    }

}
