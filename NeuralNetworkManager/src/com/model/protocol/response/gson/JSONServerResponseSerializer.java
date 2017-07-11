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
package com.model.protocol.response.gson;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.model.protocol.response.ServerResponse;
import java.lang.reflect.Type;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class JSONServerResponseSerializer implements JsonSerializer<ServerResponse> {

    private final String codeName, messageName, dataName;
    
    public JSONServerResponseSerializer() {
        codeName = "code";
        messageName = "message";
        dataName = "data";
    }

    @Override
    public JsonElement serialize(ServerResponse src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject obj = new JsonObject();
        obj.addProperty(codeName, src.getCode());
        obj.addProperty(messageName, src.getMessage());
        obj.addProperty(dataName, src.getData());
        return obj;
    }
    
}
