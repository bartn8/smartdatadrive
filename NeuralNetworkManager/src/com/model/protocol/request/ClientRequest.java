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
package com.model.protocol.request;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class ClientRequest {

    private int command;
    private String data;
    private String file64;
    private String image64;
    private String points64;

    public ClientRequest() {
        this.command = 0;
        this.data = "";
        this.file64 = "";
        this.image64 = "";
        this.points64 = "";
    }

    public ClientRequest(int command, String data, String file64, String image64, String points64) {
        this.command = command;
        this.data = data;
        this.file64 = file64;
        this.image64 = image64;
        this.points64 = points64;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public int getCommand() {
        return command;
    }

    public void setCommand(int command) {
        this.command = command;
    }

    public String getImage64() {
        return image64;
    }

    public void setImage64(String image64) {
        this.image64 = image64;
    }

    public String getPoints64() {
        return points64;
    }

    public void setPoints64(String points64) {
        this.points64 = points64;
    }

    public void setFile64(String file64) {
        this.file64 = file64;
    }

    public String getFile64() {
        return file64;
    }

}
