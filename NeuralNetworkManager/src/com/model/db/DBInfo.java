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
package com.model.db;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class DBInfo {

    private String protocol;
    private String serverURL;
    private int porta;
    private String username;
    private String password;
    private String dbName;

    public DBInfo() {
        
    }

    public DBInfo(String protocol, String serverURL, int porta, String username, String password, String dbName) {
        this.protocol = protocol;
        this.serverURL = serverURL;
        this.porta = porta;
        this.username = username;
        this.password = password;
        this.dbName = dbName;
    }

    public void setServerURL(String serverURL) {
        this.serverURL = serverURL;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getServerURL() {
        return serverURL;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getDbName() {
        return dbName;
    }

    public int getPorta() {
        return porta;
    }

    public void setPorta(int porta) {
        this.porta = porta;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    /**
     * Restituisce un url valido per ottenere una connessione.
     *
     * @param protocol esempio jdbc:mysql://
     * @return
     */
    public String getURL(String protocol) {
        return protocol + serverURL + ":" + porta + "/" + dbName;
    }

    public String getURL() {
        return getURL(protocol);
    }

}
