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
package com.model.protocol.request.gson;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.model.protocol.request.ClientRequest;
import java.lang.reflect.Type;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class JSONClientRequestDeserializer implements JsonDeserializer<ClientRequest> {

    private final String commandName;
    private final String dataName;
    private final String file64Name;
    private final String image64Name;
    private final String points64Name;

    public JSONClientRequestDeserializer() {
        commandName = "command";
        dataName = "data";
        image64Name = "image64";
        points64Name = "points64";
        file64Name = "file64";
    }

    @Override
    public ClientRequest deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        int command = 0;
        String data = "";
        String file64 = "";
        String image64 = "";
        String points64 = "";

        JsonObject jsonObject = json.getAsJsonObject();
        JsonElement getCommandElement = jsonObject.get(commandName);
        JsonElement getDataElement = jsonObject.get(dataName);
        JsonElement getFile64Element = jsonObject.get(file64Name);
        JsonElement getImage64Element = jsonObject.get(image64Name);
        JsonElement getPoints64Element = jsonObject.get(points64Name);

        if (getCommandElement != null) {
            command = getCommandElement.getAsInt();
        }

        if (getDataElement != null) {
            data = getDataElement.getAsString();
        }

        if (getFile64Element != null) {
            file64 = getFile64Element.getAsString();
        }
        
        if (getImage64Element != null) {
            image64 = getImage64Element.getAsString();
        }

        if (getPoints64Element != null) {
            points64 = getPoints64Element.getAsString();
        }
        
        return new ClientRequest(command, data, file64,image64,points64);
    }

}
