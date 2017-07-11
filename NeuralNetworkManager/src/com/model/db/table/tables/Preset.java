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
import com.model.db.table.tables.wrapper.WrapperPreset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Preset extends Table<WrapperPreset> {
    
    public Preset(DBConnection con) {
        super(con);
    }
    
    public int ricavaPresets() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT id, nome, descrizione, mime, tipo_rete_neurale AS tipo,learning_rule AS lrnRule, learning_rate AS lrnRate, max_error AS me, max_error_function AS meFunction, transfer_function AS transferFunction, hidden_layers AS hiddenLayers, width, height, color_mode AS colorMode, plugins "
                    + "FROM preset")) {
                
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperPreset preset = new WrapperPreset(
                                rs.getInt("id"),
                                rs.getString("nome"),
                                rs.getString("descrizione"),
                                rs.getString("mime"),
                                rs.getString("tipo"),
                                rs.getString("lrnRule"),
                                rs.getDouble("lrnRate"),
                                rs.getDouble("me"),
                                rs.getString("meFunction"),
                                rs.getString("transferFunction"),
                                rs.getString("hiddenLayers"),
                                rs.getInt("width"),
                                rs.getInt("height"),
                                rs.getString("colorMode"),
                                rs.getString("plugins")
                        );
                        this.out.add(preset);
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
    
    public int ricavaPreset(int presetID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT id, nome, descrizione, mime, tipo_rete_neurale AS tipo,learning_rule AS lrnRule, learning_rate AS lrnRate, max_error AS me, max_error_function AS meFunction, transfer_function AS transferFunction, hidden_layers AS hiddenLayers, width, height, color_mode AS colorMode, plugins "
                    + "FROM preset "
                    + "WHERE id = ?")) {
                
                ps.setInt(1, presetID);
                
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        WrapperPreset preset = new WrapperPreset(
                                presetID,
                                rs.getString("nome"),
                                rs.getString("descrizione"),
                                rs.getString("mime"),
                                rs.getString("tipo"),
                                rs.getString("lrnRule"),
                                rs.getDouble("lrnRate"),
                                rs.getDouble("me"),
                                rs.getString("meFunction"),
                                rs.getString("transferFunction"),
                                rs.getString("hiddenLayers"),
                                rs.getInt("width"),
                                rs.getInt("height"),
                                rs.getString("colorMode"),
                                rs.getString("plugins")
                        );
                        this.out.add(preset);
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
