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
package com.model.protocol.request.wrapper.gson;

import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.model.protocol.request.wrapper.Point64Wrapper;
import java.lang.reflect.Type;
import java.util.Iterator;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class JSONPointsDeserializer implements JsonDeserializer<Point64Wrapper[]> {

    private final String xName;
    private final String yName;
    private final String diameterName;

    public JSONPointsDeserializer() {
        xName = "x";
        yName = "y";
        diameterName = "dm";
    }

    @Override
    public Point64Wrapper[] deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        JsonArray jsonArray = json.getAsJsonArray();
        Point64Wrapper[] points = new Point64Wrapper[jsonArray.size()];
        Iterator<JsonElement> iterator = jsonArray.iterator();

        for (int i = 0; iterator.hasNext(); i++) {
            JsonElement next = iterator.next();
            JsonObject jobject = next.getAsJsonObject();

            double x = 0.0;
            double y = 0.0;
            double diameter = 1.0;

            JsonElement getXElement = jobject.get(xName);
            JsonElement getYElement = jobject.get(yName);
            JsonElement getDiameterElement = jobject.get(diameterName);

            if (getXElement != null) {
                x = getXElement.getAsDouble();
            }

            if (getYElement != null) {
                y = getYElement.getAsDouble();
            }

            if (getDiameterElement != null) {
                diameter = getDiameterElement.getAsDouble();
            }

            points[i] = new Point64Wrapper(
                    x,
                    y,
                    diameter);
        }

        return points;
    }

}
