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
import com.model.db.table.tables.wrapper.WrapperDataset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Dataset extends Table<WrapperDataset> {

    public Dataset(DBConnection con) {
        super(con);
    }

    public int aggiungiDatasets() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "INSERT INTO dataset (id_rete, id_file, input_layers, output_layers, max_error) VALUES (?,?,?,?,?);",
                    Statement.RETURN_GENERATED_KEYS)) {

                int rows = 0;

                for (WrapperDataset w : this.in) {
                    ps.setInt(1, w.getNeuralID());
                    ps.setInt(2, w.getFileID());
                    ps.setInt(3, w.getInputLayers());
                    ps.setInt(4, w.getOutputLayers());

                    if (w.getMaxError() > 0) {
                        ps.setDouble(5, w.getMaxError());
                    } else {
                        ps.setNull(5, Types.DOUBLE);
                    }

                    rows += ps.executeUpdate();

                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (rs.next()) {
                            int id = rs.getInt(1);

                            WrapperDataset wOut = new WrapperDataset();
                            wOut.setID(id);
                            wOut.setNeuralID(w.getNeuralID());
                            wOut.setFileID(w.getFileID());
                            wOut.setInputLayers(w.getInputLayers());
                            wOut.setOutputLayers(w.getOutputLayers());
                            wOut.setMaxError(w.getMaxError());
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

    public int ricavaDatasetRete(int userID, int neuralID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT dset.id AS datasetID, dset.id_file AS fileID, input_layers AS inputLayers, output_layers AS outputLayers, dset.data_creazione AS datac, max_error AS maxError "
                    + "FROM dataset AS dset "
                    + "INNER JOIN file ON  file.id = dset.id_file "
                    + "INNER JOIN directory AS dir ON dir.id = file.id_directory "
                    + "INNER JOIN drive ON drive.id = dir.id_drive "
                    + "WHERE drive.id_utente = ? AND dset.id_rete = ?;")) {

                ps.setInt(1, userID);
                ps.setInt(2, neuralID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperDataset dataset = new WrapperDataset(
                                rs.getInt("datasetID"),
                                neuralID,
                                rs.getInt("fileID"),
                                rs.getDouble("maxError"),
                                rs.getInt("inputLayers"),
                                rs.getInt("outputLayers"),
                                rs.getTimestamp("datac")
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

    public int ricavaDataset(int userID, int datasetID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT dset.id_rete AS neuralID, dset.id_file AS fileID, input_layers AS inputLayers, output_layers AS outputLayers, dset.data_creazione AS datac, max_error AS maxError "
                    + "FROM dataset AS dset "
                    + "INNER JOIN file ON  file.id = dset.id_file "
                    + "INNER JOIN drive ON drive.id = file.id_drive "
                    + "WHERE drive.id_utente = ? AND dset.id = ?;")) {

                ps.setInt(1, userID);
                ps.setInt(2, datasetID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperDataset dataset = new WrapperDataset(
                                datasetID,
                                rs.getInt("neuralID"),
                                rs.getInt("fileID"),
                                rs.getDouble("maxError"),
                                rs.getInt("inputLayers"),
                                rs.getInt("outputLayers"),
                                rs.getTimestamp("datac")
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

    public int updateMaxErrorDatasets() {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "UPDATE dataset SET max_error = ? WHERE dataset.id = ?;")) {

                int rows = 0;

                for (WrapperDataset w : this.in) {
                    if (w.getMaxError() > 0) {
                        ps.setDouble(1, w.getMaxError());
                    } else {
                        ps.setNull(1, Types.DOUBLE);
                    }
                    ps.setInt(2, w.getID());

                    rows += ps.executeUpdate();

                    out.add(w);
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

    public int rimuoviDataset(int userID, int datasetID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "DELETE dset.* "
                    + "FROM dataset AS dset "
                    + "INNER JOIN file ON file.id = dset.id_file "
                    + "INNER JOIN drive ON drive.id = file.id_drive "
                    + "WHERE dset.id = ? AND drive.id_utente = ?")) {

                ps.setInt(1, datasetID);
                ps.setInt(2, userID);

                int rows = ps.executeUpdate();

                switch (rows) {
                    case 0:
                        super.addResult(3, "Errore query: nessuna riga modificata");
                        return 3;
                    case 1:
                        super.addResult(0, "");
                        return 0;
                    default:
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

    public int ricavaDatasetTag(int tagID) {
        try (Connection connessione = getCon()) {
            try (PreparedStatement ps = connessione.prepareStatement(
                    "SELECT dset.id AS datasetID, dset.id_rete AS neuralID, dset.id_file AS fileID, input_layers AS inputLayers, output_layers AS outputLayers, dset.data_creazione AS datac, max_error AS maxError "
                    + "FROM dataset AS dset "
                    + "INNER JOIN rete_neurale AS ntk ON ntk.id = dset.id_rete "
                    + "WHERE ntk.id_tag = ?;")) {

                ps.setInt(1, tagID);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        WrapperDataset dataset = new WrapperDataset(
                                rs.getInt("datasetID"),
                                rs.getInt("neuralID"),
                                rs.getInt("fileID"),
                                rs.getDouble("maxError"),
                                rs.getInt("inputLayers"),
                                rs.getInt("outputLayers"),
                                rs.getTimestamp("datac")
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
