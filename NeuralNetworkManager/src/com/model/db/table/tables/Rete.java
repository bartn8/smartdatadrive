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
import com.model.db.table.tables.wrapper.WrapperRete;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Rete extends Table<WrapperRete> {

    public Rete(DBConnection con) {
        super(con);
    }

    public int inserisciReti() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "INSERT INTO rete_neurale (id_tag, id_preset, modello)"
                    + " VALUES (?, ?, GeomFromText(?));",
                    Statement.RETURN_GENERATED_KEYS)) {

                int rows = 0;

                for (WrapperRete w : this.in) {
                    ps.setInt(1, w.getTagID());
                    ps.setInt(2, w.getPresetID());
                    ps.setString(3, w.getModello());

                    rows += ps.executeUpdate();

                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (rs.next()) {
                            int id = rs.getInt(1);

                            WrapperRete wOut = new WrapperRete();
                            wOut.setID(id);
                            wOut.setModello(w.getModello());
                            wOut.setTagID(w.getTagID());
                            wOut.setPresetID(w.getPresetID());

                            out.add(wOut);
                        }
                    }
                }

                if (rows == 0) {
                    super.addResult(3, "Errore query: nessuna riga modificata");
                    return 3;
                } else if (rows == this.in.size()) {
                    super.addResult(0, "");
                    return 0;
                } else {
                    super.addResult(4, "Errore query: righe non coincidenti (" + rows + ")");
                    return 4;
                }

            } catch (SQLException ex) {
                super.addResult(2, "ErroreSQL(Statement): " + ex.getMessage());
                return 2;
            }
        } catch (SQLException ex) {
            super.addResult(1, "ErroreSQL(Connection): " + ex.getMessage());
            return 1;
        }
    }

    public int ricavaReteDaTag(int tagID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT id, id_preset AS presetID, AsText(modello) AS modello FROM rete_neurale "
                    + "WHERE id_tag = ?")) {

                ps.setInt(1, tagID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperRete dataset = new WrapperRete(
                                rs.getInt("id"),
                                tagID,
                                rs.getInt("presetID"),
                                rs.getString("modello")
                        );
                        this.out.add(dataset);
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

    public int ricavaRete(int neuralID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT id_tag AS tagID, id_preset AS presetID, AsText(modello) AS modello FROM rete_neurale "
                    + "WHERE id = ?")) {

                ps.setInt(1, neuralID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperRete dataset = new WrapperRete(
                                neuralID,
                                rs.getInt("tagID"),
                                rs.getInt("presetID"),
                                rs.getString("modello")
                        );
                        this.out.add(dataset);
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

    public int ricavaRetiGenerali(int userID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT rtn.id, rtn.id_tag AS tagID, rtn.id_preset AS presetID "
                    + "FROM rete_neurale AS rtn "
                    + "INNER JOIN tag ON tag.id = rtn.id_tag "
                    + "WHERE tag.id_parent IS NULL AND (tag.id_creatore = ? OR tag.condivisibile = 1)")) {

                ps.setInt(1, userID);
                
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperRete dataset = new WrapperRete(
                                rs.getInt("id"),
                                rs.getInt("tagID"),
                                rs.getInt("presetID"),
                                ""
                        );
                        this.out.add(dataset);
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

    public int ricavaRetiFiglie(int tagParentID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT rtn.id, rtn.id_tag AS tagID, rtn.id_preset AS presetID, AsText(rtn.modello) AS modello "
                    + "FROM rete_neurale AS rtn "
                    + "INNER JOIN tag ON tag.id = rtn.id_tag "
                    + "WHERE tag.id_parent = ?")) {

                ps.setInt(1, tagParentID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperRete dataset = new WrapperRete(
                                rs.getInt("id"),
                                rs.getInt("tagID"),
                                rs.getInt("presetID"),
                                rs.getString("modello")
                        );
                        this.out.add(dataset);
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

    public int ricavaReti() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT id, id_tag AS tagID, id_preset AS presetID, AsText(modello) AS modello FROM rete_neurale")) {

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperRete dataset = new WrapperRete(
                                rs.getInt("id"),
                                rs.getInt("tagID"),
                                rs.getInt("presetID"),
                                rs.getString("modello")
                        );
                        this.out.add(dataset);
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
