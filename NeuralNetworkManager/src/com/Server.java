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

import com.model.util.Configuration;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Server implements Runnable {

    private static final Logger LOG = Logger.getLogger(Server.class.getName());

    /**
     * boolean di chiususa server. Vero se il server è stato chiuso.
     */
    private boolean serverChiuso = false;
    /**
     * Thread che avvia il server parallelamente.
     */
    private Thread questoThread;
    /**
     * Accetta le connessioni in entrata.
     */
    private final ServerSocket socketServer;
    /**
     * Porta usata dal server.
     */
    private final int porta;
    /**
     * File di configurazione.
     */
    private final Configuration conf;

    public Server(int porta, Configuration conf) throws IOException {
        this.porta = porta;
        socketServer = new ServerSocket(porta);
        this.conf = conf;
    }

    public void start() {
        if (questoThread == null && socketServer != null) {
            questoThread = new Thread(this);
            questoThread.setName("Server " + this.porta);
            questoThread.start();
        }
    }

    public void close() throws IOException {
        if (!this.serverChiuso) {
            //Imposto l' obbligo di fermata al thread.
            this.serverChiuso = true;
            try {
                //Aspetto che il thread si fermi.
                this.questoThread.join();
            } catch (InterruptedException ex) {
                LOG.log(Level.SEVERE, "Errore thread JOIN", ex);
            }
            this.socketServer.close();
        }
    }

    @Override
    public void run() {
        try {
            socketServer.setSoTimeout(500);
        } catch (SocketException ex) {
            LOG.log(Level.SEVERE, "Errore nell' impostare il timeout del nuovo client", ex);
        }

        LOG.log(Level.INFO, "Server in attesa di client...");

        while (!this.serverChiuso) {
            try {
                /*
                 * Attendo fino a quando non arriva un client oppure scade il timeout.
                 * Setto il timeout del client e avvio il suo thread.
                 */
                Socket socketClient = socketServer.accept();
                socketClient.setSoTimeout(5000);
                
                ClientResponser client = new ClientResponser(socketClient, conf);
                client.logStart();
                client.start();

            } catch (SocketTimeoutException | SocketException ex) {
                /*
                 * Nessun client si è connesso entro il tempo massimo. 
                 * Si ripete normalemente il ciclo.
                 */
            } catch (IOException ex) {
                LOG.log(Level.SEVERE, "Errore accettazione client", ex);
            }
        }
    }

    public boolean isServerChiuso() {
        return serverChiuso;
    }

    public int getPorta() {
        return porta;
    }

}
