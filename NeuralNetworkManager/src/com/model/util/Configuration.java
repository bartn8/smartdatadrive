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
package com.model.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Configuration {

    private static final Logger LOG = Logger.getLogger(Configuration.class.getName());

    private final File confFile;
    private final Properties prop;
    //NEURALNETWORKMANAGER
    private String neuralNetworksFolderName;
    private String datasetsFolderName;
    private int servicePort;
    private int maxIterations;
    private int threads;
    //MYSQL
    private String mysqlServerURL;
    private String mysqlUsername;
    private String mysqlPassword;
    private String mysqlDbName;
    private int mysqlPort;
    private String mysqlProtocol;

    public Configuration() {
        this(new File("conf.ini"));
    }

    public Configuration(String confFileName) {
        this(new File(confFileName));
    }

    public Configuration(File confFile) {
        this.confFile = confFile;
        this.prop = new Properties();
        //NEURALNETWORKMANAGER
        this.neuralNetworksFolderName = "networks";
        this.datasetsFolderName = "datasets";
        this.servicePort = 30001;
        this.maxIterations = 10000;
        this.threads = 1;
        //MYSQL
        this.mysqlServerURL = "";
        this.mysqlUsername = "";
        this.mysqlPassword = "";
        this.mysqlDbName = "";
        this.mysqlPort = 3306;
        this.mysqlProtocol = "jdbc:mysql://";
    }

    public void load() {
        try (FileInputStream in = new FileInputStream(confFile)) {
            prop.load(in);

            this.neuralNetworksFolderName = prop.getProperty("networksFolderName");
            this.datasetsFolderName = prop.getProperty("datasetsFolderName");
            this.servicePort = Integer.parseInt(prop.getProperty("servicePort"));
            this.maxIterations = Integer.parseInt(prop.getProperty("maxIterations"));
            this.threads = Integer.parseInt(prop.getProperty("threads"));

            this.mysqlServerURL = prop.getProperty("mysqlServerURL");
            this.mysqlUsername = prop.getProperty("mysqlUsername");
            this.mysqlPassword = prop.getProperty("mysqlPassword");
            this.mysqlDbName = prop.getProperty("mysqlDbName");
            this.mysqlPort = Integer.parseInt(prop.getProperty("mysqlPort"));
            this.mysqlProtocol = prop.getProperty("mysqlProtocol");

        } catch (FileNotFoundException ex) {
            LOG.severe("File di configurazione non trovato!");
        } catch (IOException ex) {
            LOG.severe("Impossibile leggere file di configurazione");
        }
    }

    public int getMaxIterations() {
        return maxIterations;
    }

    public String getNeuralNetworksFolderName() {
        return neuralNetworksFolderName;
    }

    public String getDatasetsFolderName() {
        return datasetsFolderName;
    }

    public int getServicePort() {
        return servicePort;
    }

    public String getMysqlServerURL() {
        return mysqlServerURL;
    }

    public String getMysqlUsername() {
        return mysqlUsername;
    }

    public String getMysqlPassword() {
        return mysqlPassword;
    }

    public String getMysqlDbName() {
        return mysqlDbName;
    }

    public int getMysqlPort() {
        return mysqlPort;
    }

    public String getMysqlProtocol() {
        return mysqlProtocol;
    }

    public int getThreads() {
        return threads;
    }

}
