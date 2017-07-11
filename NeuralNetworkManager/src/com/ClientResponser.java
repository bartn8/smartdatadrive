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
package com;

import com.controller.Controller;
import java.io.IOException;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.model.protocol.JsonStreamManager;
import com.model.protocol.request.ClientRequest;
import com.model.protocol.response.ServerResponse;
import com.model.util.Configuration;

/**
 * Gestisce il comando richiesto dal client poi chiude.
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class ClientResponser implements Runnable {

    private static final Logger LOG = Logger.getLogger(ClientResponser.class.getName());

    /**
     * Thread che gestisce le comunicazioni con il client.
     */
    private final Thread questoThread;
    /**
     * Gestore dello stream tra il client e il server.
     */
    private JsonStreamManager streamManager;
    /**
     * Gestirà la risposta al client.
     */
    private final Controller controller;
    /**
     * Socket tra server e client.
     */
    private final Socket socketClient;

    public ClientResponser(Socket socketClient, Configuration conf) {
        this.socketClient = socketClient;
        this.questoThread = new Thread(this);
        this.controller = new Controller(conf);
    }

    /**
     * Avvia il thread.
     */
    public void start() {
        this.questoThread.setName("Responser " + socketClient.getPort());
        this.questoThread.start();
    }

    @Override
    public void run() {
        try {
            //Istanza dello stream
            this.streamManager = new JsonStreamManager(socketClient.getInputStream(), socketClient.getOutputStream());

            //Prova a interpretare il flusso.
            ClientRequest request = this.streamManager.readRequest();

            controller.setRequest(request);
            try {
                controller.elaboraRisposta();
                ServerResponse response = controller.getResponse();
                this.streamManager.sendResponse(response);
            } catch (Throwable t) {
                LOG.log(Level.SEVERE, "Errore grave:", t);
            }

            this.streamManager.flushAndClose();
        } catch (IOException ex) {
            LOG.log(Level.WARNING, "(Client Responser) Errore I/O", ex);
        }
        logStop();
    }

    public void logStart() {
        LOG.log(Level.INFO, "Connessione effettuata da: {0}:{1}", new Object[]{socketClient.getInetAddress(), socketClient.getPort()});
    }

    private void logStop() {
        LOG.log(Level.INFO, "Disconnessione effettuata da: {0}:{1}", new Object[]{socketClient.getInetAddress(), socketClient.getPort()});
    }

}
