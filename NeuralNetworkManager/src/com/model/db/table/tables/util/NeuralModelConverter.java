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
package com.model.db.table.tables.util;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class NeuralModelConverter {

    private int inputLayer;
    private int[] hiddenLayers;
    private int outputLayer;
    private String multipointString;

    public NeuralModelConverter() {
    }

    public void multipointToLayers() {
        int startIndex = multipointString.indexOf("(") + 1;
        int endIndex = multipointString.indexOf(")");
        String substring = multipointString.substring(startIndex, endIndex);
        String[] split = substring.split(",");

        //Ricerca numero hiddenlayers.
        int maxY = -1;
        for (String coppia : split) {
            String[] singoli = coppia.split(" ");
            int y = Integer.parseInt(singoli[1]);

            if (y > maxY) {
                maxY = y;
            }
        }

        int tmpInputLayer = 0;
        int[] tmpHiddenLayers = new int[maxY - 1];
        int tmpOutputLayer = 0;

        for (String coppia : split) {
            String[] singoli = coppia.split(" ");
            int y = Integer.parseInt(singoli[1]);

            if (y == 0) {
                tmpInputLayer++;
            } else if (y == maxY) {
                tmpOutputLayer++;
            } else {
                tmpHiddenLayers[y - 1]++;
            }
        }

        this.inputLayer = tmpInputLayer;
        this.outputLayer = tmpOutputLayer;
        this.hiddenLayers = tmpHiddenLayers;

    }

    public void layersToMultipoint() {
        StringBuilder build = new StringBuilder();
        int y = 0;
        build.append("MULTIPOINT(");

        //Input layer
        for (int i = 0; i < inputLayer; i++) {
            build.append(i).append(" ").append(y).append(",");
        }

        y++;

        //Hidden layers
        for (int i = 0; i < hiddenLayers.length; i++, y++) {
            for (int j = 0; j < hiddenLayers[i]; j++) {
                build.append(j).append(" ").append(y).append(",");
            }
        }

        //Output layer
        for (int i = 0; i < outputLayer; i++) {
            build.append(i).append(" ").append(y);
            if (i + 1 != outputLayer) {
                build.append(",");
            }
        }

        build.append(")");

        multipointString = build.toString();
    }

    public int getInputLayer() {
        return inputLayer;
    }

    public void setInputLayer(int inputLayer) {
        this.inputLayer = inputLayer;
    }

    public int[] getHiddenLayers() {
        return hiddenLayers;
    }

    public void setHiddenLayers(int[] hiddenLayers) {
        this.hiddenLayers = hiddenLayers;
    }

    public int getOutputLayer() {
        return outputLayer;
    }

    public void setOutputLayer(int outputLayer) {
        this.outputLayer = outputLayer;
    }

    public String getMultipointString() {
        return multipointString;
    }

    public void setMultipointString(String multipointString) {
        this.multipointString = multipointString;
    }

}
