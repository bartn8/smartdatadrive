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
package com.model.db.table.tables;

import com.model.db.DBConnection;
import com.model.db.table.Table;
import com.model.db.table.tables.wrapper.WrapperFeedback;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author luca
 */
public class Feedback extends Table<WrapperFeedback> {

    public Feedback(DBConnection con) {
        super(con);
    }

    public int restituisciFeedback(int seq, int userID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT  fileID, neuralID, tagID, presetID "
                    + "FROM feedback "
                    + "WHERE seq = ? AND userID = ?")) {

                ps.setInt(1, seq);
                ps.setInt(2, userID);

                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {

                        WrapperFeedback feedback = new WrapperFeedback(
                                seq,
                                rs.getInt("fileID"),
                                rs.getInt("neuralID"),
                                rs.getInt("tagID"),
                                rs.getInt("presetID"),
                                userID
                        );

                        out.add(feedback);
                    }
                } catch (SQLException ex) {
                    super.addResult(3, "ErroreSQL(executeQuery): " + ex.getMessage());
                    return 3;
                }
            } catch (SQLException ex) {
                super.addResult(2, "ErroreSQL(Statement): " + ex.getMessage());
                return 2;
            }
        } catch (SQLException ex) {
            super.addResult(1, "ErroreSQL(Connection): " + ex.getMessage());
            return 1;
        }
        super.addResult(0, "");
        return 0;
    }

}
