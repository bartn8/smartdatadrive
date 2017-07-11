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
import com.model.db.table.tables.wrapper.WrapperRiscontro;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Statement;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Riscontro extends Table<WrapperRiscontro> {

    public Riscontro(DBConnection con) {
        super(con);
    }

    public int inserisciRiscontri() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "INSERT INTO riscontro_neurale (id_rete, id_file, riscontro) VALUES (?,?,?)",
                    Statement.RETURN_GENERATED_KEYS)) {

                for (WrapperRiscontro w : this.in) {
                    ps.setInt(1, w.getNeuralID());
                    ps.setInt(2, w.getFileID());
                    ps.setDouble(3, w.getRiscontro());

                    ps.executeUpdate();

                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (rs.next()) {
                            int seq = rs.getInt(1);
                            w.setSeq(seq);
                        }
                    }
                }
            }catch(SQLIntegrityConstraintViolationException ex){
                super.addResult(3, "Errore Constraint(Statement): " + ex.getMessage());
                return 3;
            }
            catch (SQLException ex) {
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
    
    public int rimuoviRiscontri(){
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "DELETE FROM riscontro_neurale WHERE id_rete = ? AND id_file = ?")) {

                for (WrapperRiscontro w : this.in) {
                    ps.setInt(1, w.getNeuralID());
                    ps.setInt(2, w.getFileID());

                    ps.executeUpdate();
                }
            }catch (SQLException ex) {
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
