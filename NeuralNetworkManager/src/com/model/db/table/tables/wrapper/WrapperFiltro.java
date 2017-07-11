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
package com.model.db.table.tables.wrapper;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class WrapperFiltro {

    private int ID;
    private String nome;
    private String descrizione;
    private String mime;

    public WrapperFiltro(int ID, String nome, String descrizione, String mime) {
        this.ID = ID;
        this.nome = nome;
        this.descrizione = descrizione;
        this.mime = mime;
    }

    public WrapperFiltro() {
        this.ID = 0;
        this.nome = "";
        this.descrizione = "";
        this.mime = "";
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getMime() {
        return mime;
    }

    public void setMime(String mime) {
        this.mime = mime;
    }

}
