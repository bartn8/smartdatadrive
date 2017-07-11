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

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class DBConnection {

    public static void initDriver() throws ClassNotFoundException {
        Class.forName("org.mariadb.jdbc.Driver");
    }

    private final DBInfo info;

    public DBConnection() {
        info = new DBInfo();
    }

    public DBConnection(DBInfo info) {
        this.info = info;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(info.getURL(), info.getUsername(), info.getPassword());
    }

}
