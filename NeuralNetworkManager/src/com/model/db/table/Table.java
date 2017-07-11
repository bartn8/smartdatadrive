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
package com.model.db.table;

import com.model.db.DBConnection;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 * @param <T>
 */
public class Table<T> {

    private static final Logger LOG = Logger.getLogger(Table.class.getName());

    protected DBConnection dbCon;

    protected final ArrayList<Integer> resultsCode;
    protected final ArrayList<String> resultsMessage;

    protected final ArrayList<T> in;
    protected final ArrayList<T> out;

    public Table(DBConnection con) {
        this.dbCon = con;
        resultsCode = new ArrayList<>();
        resultsMessage = new ArrayList<>();
        in = new ArrayList<>();
        out = new ArrayList<>();
    }

    public Connection getCon() throws SQLException {
        return dbCon.getConnection();
    }

    protected void addResult(int code, String message) {
        if (code != 0) {
            LOG.log(Level.SEVERE, "code:{0} message:{1}", new Object[]{code, message});
        }
        resultsCode.add(code);
        resultsMessage.add(message);
    }

    public int getLastResultCode() {
        return resultsCode.isEmpty() ? -1 : resultsCode.get(resultsCode.size() - 1);
    }

    public String getLastResultMessage() {
        return resultsMessage.isEmpty() ? "" : resultsMessage.get(resultsMessage.size() - 1);
    }

    public void clearResults() {
        resultsCode.clear();
        resultsMessage.clear();
    }

    public boolean addIn(T e) {
        return in.add(e);
    }

    public boolean addAllIn(Collection<? extends T> clctn) {
        return in.addAll(clctn);
    }

    public void clearIn() {
        in.clear();
    }

    public void clearOut() {
        out.clear();
    }

    public ArrayList<T> getOut() {
        return new ArrayList<>(out);
    }

}
