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
import com.model.db.table.tables.wrapper.WrapperFiltro;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Filtro extends Table<WrapperFiltro> {

    public Filtro(DBConnection con) {
        super(con);
    }

    public int ricavaFiltri() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT id, nome, descrizione, mime "
                    + "FROM filtro")) {

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperFiltro preset = new WrapperFiltro(
                                rs.getInt("id"),
                                rs.getString("nome"),
                                rs.getString("descrizione"),
                                rs.getString("mime")
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

    public int ricavaFiltriPreset(int presetID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT flt.id, flt.nome, flt.descrizione, flt.mime "
                    + "FROM filtro AS flt "
                    + "INNER JOIN preset_filtro_link AS lnk ON lnk.id_filtro = flt.id "
                    + "WHERE lnk.id_preset = ?")) {
                
                ps.setInt(1, presetID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperFiltro preset = new WrapperFiltro(
                                rs.getInt("id"),
                                rs.getString("nome"),
                                rs.getString("descrizione"),
                                rs.getString("mime")
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
