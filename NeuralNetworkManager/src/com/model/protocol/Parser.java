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
package com.model.protocol;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.model.protocol.request.wrapper.Image64Wrapper;
import com.model.protocol.request.wrapper.Point64Wrapper;
import com.model.protocol.request.wrapper.gson.JSONPointsDeserializer;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Parser {

    private final Decoder decoder64;
    private final Gson gson;

    public Parser() {
        decoder64 = Base64.getDecoder();

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Point64Wrapper[].class, new JSONPointsDeserializer());
        gson = builder.create();
    }

    public Image64Wrapper parseImage64(String image64) throws IOException {
        String[] parts = image64.split("[;]");

        if (parts.length == 2) {
            //Ricerca tipo immagine.
            String mime = parts[0];
            String[] parts2 = parts[1].split(",");

            BufferedImage image;
            byte[] parseBase64Binary = DatatypeConverter.parseBase64Binary(parts2[1]);
            try (ByteArrayInputStream bis = new ByteArrayInputStream(parseBase64Binary)) {
                image = ImageIO.read(bis);
            }
            return new Image64Wrapper(mime, image);
        }

        return new Image64Wrapper();
    }

    public Image64Wrapper parseImage64(String mime, String image64) throws IOException {
        if (image64.contains(",")) {
            String subString = image64.substring(image64.indexOf(","));

            BufferedImage image;
            byte[] parseBase64Binary = DatatypeConverter.parseBase64Binary(subString);
            try (ByteArrayInputStream bis = new ByteArrayInputStream(parseBase64Binary)) {
                image = ImageIO.read(bis);
            }

            return new Image64Wrapper(mime, image);
        }else if(!image64.isEmpty()){
            BufferedImage image;
            byte[] parseBase64Binary = DatatypeConverter.parseBase64Binary(image64);
            try (ByteArrayInputStream bis = new ByteArrayInputStream(parseBase64Binary)) {
                image = ImageIO.read(bis);
            }

            return new Image64Wrapper(mime, image);
        }
        return new Image64Wrapper();
    }

    public Point64Wrapper[] parsePoints64(String points64) {
        byte[] decodedBytes = decoder64.decode(points64);

        if (decodedBytes.length > 0) {
            String decodedString = new String(decodedBytes);
            return gson.fromJson(decodedString, Point64Wrapper[].class);
        }

        return new Point64Wrapper[0];
    }

    public HashMap<String, String> parseData(String data) {
        HashMap<String, String> datas = new HashMap<>();
        String[] stringDatas = data.split("[;]");
        for (String stringData : stringDatas) {
            String[] split = stringData.split("=");
            datas.put(split[0], split[1]);
        }
        return datas;
    }

    public String parseDatas(HashMap<String, String> datas) {
        StringBuilder builder = new StringBuilder();

        Set<Map.Entry<String, String>> entrySet = datas.entrySet();
        Iterator<Map.Entry<String, String>> iterator = entrySet.iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> next = iterator.next();
            builder.append(next.getKey()).append("=").append(next.getValue()).append(";");
        }
        return builder.toString();
    }
}
