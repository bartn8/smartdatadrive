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
package neuralnetworkmanager;

import com.Server;
import com.model.util.Configuration;
import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.Scanner;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class NeuralNetworkManager {

    /**
     * @param args the command line arguments
     * @throws java.io.IOException
     */
    public static void main(String[] args) throws IOException {
        Configuration conf = null;
        boolean shadow = false;
        //Caricamento Argomenti
        for (String arg : args) {
            String[] split = arg.split(":");
            if (split.length == 2) {
                switch (split[0]) {
                    case "--configFile":
                        conf = new Configuration(split[1]);
                    case "--shadow":
                        shadow = "true".equals(split[1]);
                }
            } else {
                throw new IllegalArgumentException("Errore formato: java -jar NeuralNetworkManager.jar [--opt:value]");
            }
        }

        if (conf == null) {
            conf = new Configuration();
        }

        conf.load();

        Server server = new Server(conf.getServicePort(), conf);
        server.start();

        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("Comando:");
            String nextLine = "";

//            try {
                nextLine = sc.nextLine();
//            } catch (NoSuchElementException ex) {
//
//            }

            if ("END".equals(nextLine)) {
                server.close();
                return;
            }
        }
    }
}
