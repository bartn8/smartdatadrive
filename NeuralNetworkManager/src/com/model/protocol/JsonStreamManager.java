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
import com.google.gson.JsonSyntaxException;
import com.model.protocol.request.ClientRequest;
import com.model.protocol.request.gson.JSONClientRequestDeserializer;
import com.model.protocol.response.ServerResponse;
import com.model.protocol.response.gson.JSONServerResponseSerializer;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class JsonStreamManager {

    private static final Logger LOG = Logger.getLogger(JsonStreamManager.class.getName());

    private final String charset = "UTF-8";

    private final Gson parser;
    private final BufferedReader reader;
    private final PrintWriter writer;

    public JsonStreamManager(InputStream in, OutputStream out) throws UnsupportedEncodingException {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(ClientRequest.class, new JSONClientRequestDeserializer());
        builder.registerTypeAdapter(ServerResponse.class, new JSONServerResponseSerializer());
        this.parser = builder.create();
        this.reader = new BufferedReader(new InputStreamReader(in, charset));
        this.writer = new PrintWriter(new OutputStreamWriter(out, charset), false);//flush al close.
    }

    /**
     *
     * @return
     */
    public ClientRequest readRequest() {
        ClientRequest request = new ClientRequest();
        String line;

        try {
            //Lettura dal flusso -> JSON contenuto in una sola riga di testo.
            //Flusso previsto: {command: 0, data: "", imageDataset:""}\n\r
            line = reader.readLine();
        } catch (IOException ex) {
            LOG.log(Level.SEVERE, "Impossibile leggere stringa", ex);
            return request;
        }

        //Trasformazione JSON -> Java Object
        try {
            request = parser.fromJson(line, ClientRequest.class);
        } catch (JsonSyntaxException ex) {
            LOG.log(Level.SEVERE, "Impossibile convertire JSON", ex);
        }

        return request;
    }

    public void sendResponse(ServerResponse response) {
        StringBuilder build = new StringBuilder();
        build.append(parser.toJson(response));
        build.append('\n');
        
        writer.write(build.toString());
    }

    public void flushAndClose() throws IOException {
        this.writer.flush();
        this.writer.close();
        this.reader.close();
    }

}
