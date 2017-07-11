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
package com.model.neural;

import com.model.io.RelativeFileManager;
import com.model.util.Configuration;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import java.util.function.DoubleConsumer;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.neuroph.core.NeuralNetwork;
import org.neuroph.core.data.DataSet;
import org.neuroph.core.exceptions.VectorSizeMismatchException;
import org.neuroph.core.learning.IterativeLearning;
import org.neuroph.core.learning.LearningRule;
import org.neuroph.core.learning.SupervisedLearning;
import org.neuroph.core.learning.error.MeanSquaredError;
import org.neuroph.imgrec.ColorMode;
import org.neuroph.imgrec.ImageRecognitionPlugin;
import org.neuroph.imgrec.image.Dimension;
import org.neuroph.nnet.*;
import org.neuroph.nnet.learning.*;
import org.neuroph.util.TransferFunctionType;
import org.neuroph.util.plugins.PluginBase;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class NeuralNetworkManager {

    private static final String CSV_SEPARATOR = ";";
    private static final String NEURALNETWORK_FILE_EXTENSION = ".nnet";
    private static final String DATASET_FILE_EXTENSION = ".dset";
    private static final Logger LOG = Logger.getLogger(NeuralNetworkManager.class.getName());

    public static BufferedImage removeAlpha(BufferedImage image) {
        BufferedImage copy = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = copy.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, copy.getWidth(), copy.getHeight());
        g2d.drawImage(image, 0, 0, null);
        g2d.dispose();
        return copy;
    }

    //Creazione di una rete-----------------------------------------------------
    private int inLayers;
    private int[] hiddenLayers;
    private int outLayers;
    private TransferFunctionType transferFunctionType;
    private LearningRule learningRule;
    private int width;
    private int height;
    private ColorMode colorMode;
    private final List<PluginBase> plugins;
    //--------------------------------------------------------------------------

    /**
     * Usato come worker nella rete per le operazioni.
     */
    private Thread worker;
    /**
     * Rete Neurale del framework Neuroph gestita.
     */
    private NeuralNetwork managedNeuralNetwork;
    /**
     * Dataset gestito. Solo uno alla volta.
     */
    private DataSet managedDataset;
    /**
     * Usato per gestire le reti salvate.
     */
    private RelativeFileManager networksFileManager;
    /**
     * Usato per gestire i dataset salvati.
     */
    private RelativeFileManager datasetsFileManager;

    public NeuralNetworkManager() {
        inLayers = 0;
        hiddenLayers = new int[0];
        outLayers = 0;
        transferFunctionType = TransferFunctionType.LINEAR;
        learningRule = new MomentumBackpropagation();
        colorMode = ColorMode.COLOR_RGB;
        plugins = new ArrayList<>();
        //networksFileManager = new RelativeFileManager();
    }

    public void asyncLearn(DoubleConsumer c) {
        if (worker != null) {
            try {
                worker.join();
            } catch (InterruptedException ex) {
                LOG.log(Level.FINE, "Join interrotto", ex);
            }
        }
        worker = new Thread(() -> {
            if (managedNeuralNetwork != null) {
                //Alleno la rete.
                managedNeuralNetwork.learn(managedDataset);
                
                LOG.log(Level.INFO, "Rete neurale istruita");

                //invio errore della rete.
                c.accept(getNetworkError());
            }
        });
        worker.start();
    }

    public double[] test(double... inputVector) throws VectorSizeMismatchException, Exception {
        if (managedNeuralNetwork != null) {
            managedNeuralNetwork.setInput(inputVector);
            managedNeuralNetwork.calculate();
            return managedNeuralNetwork.getOutput();
        }
        throw new Exception("Rete non trovata");
    }

    public double[] recognizeImage(BufferedImage image) {
        int type = image.getType();

        switch (type) {
            case BufferedImage.TYPE_CUSTOM:
            case BufferedImage.TYPE_4BYTE_ABGR:
            case BufferedImage.TYPE_4BYTE_ABGR_PRE:
            case BufferedImage.TYPE_INT_ARGB:
            case BufferedImage.TYPE_INT_ARGB_PRE:
                image = removeAlpha(image);
        }

        try {
            ImageRecognitionPlugin imageRecognition = (ImageRecognitionPlugin) managedNeuralNetwork.getPlugin(ImageRecognitionPlugin.class);

            HashMap<String, Double> recognizeImage = imageRecognition.recognizeImage(image);

            ArrayList<Double> result = new ArrayList<>();

            recognizeImage.forEach((k, v) -> {
                result.add(v);
            });

            return result.stream().mapToDouble(i -> i).toArray();
        } catch (ClassCastException ex) {
            return new double[0];
        }
    }

    public void resetAndRandomize() throws Exception {
        if (managedNeuralNetwork != null) {
            managedNeuralNetwork.reset();
            managedNeuralNetwork.randomizeWeights();
        }
        throw new Exception("Rete non trovata");
    }

    public void create(String networkTypeName) {
        switch (networkTypeName) {
            case "MultiLayerPerceptron":
                createMultiLayerPerceptron();
                break;
        }
    }

    public void createMultiLayerPerceptron() {
        List<Integer> layersNeuronsCount = new ArrayList<>();

        layersNeuronsCount.add(inLayers);
        for (int i = 0; i < hiddenLayers.length; i++) {
            layersNeuronsCount.add(hiddenLayers[i]);
        }
        layersNeuronsCount.add(outLayers);
        NeuralNetwork neuralNetwork = new MultiLayerPerceptron(layersNeuronsCount, transferFunctionType);

        plugins.forEach((p) -> {
            neuralNetwork.addPlugin(p);
        });

        neuralNetwork.setLearningRule(learningRule);

        managedNeuralNetwork = neuralNetwork;
    }

    public void initIO() {
        Configuration configuration = new Configuration();
        configuration.load();

        String neuralNetworksFolderName = configuration.getNeuralNetworksFolderName();
        String datasetsFolderName = configuration.getDatasetsFolderName();
        int it = configuration.getMaxIterations();

        this.networksFileManager = new RelativeFileManager(neuralNetworksFolderName);
        this.datasetsFileManager = new RelativeFileManager(datasetsFolderName);
        setIterations(it);
    }

    public void loadNetwork(int neuralID) throws IOException {
        File[] startsWith = this.networksFileManager.startsWith(neuralID + NEURALNETWORK_FILE_EXTENSION);

        if (startsWith.length == 1) {

            //Teoricamente c'è ne solo uno.
            this.managedNeuralNetwork = NeuralNetwork.createFromFile(startsWith[0].getAbsolutePath());
        } else {
            throw new IOException("Errore ricerca network fisica");
        }

    }

    public void loadDataset(int datasetID, int inputCount, int outputCount) throws IOException {
        File[] startsWith = this.datasetsFileManager.startsWith(datasetID + DATASET_FILE_EXTENSION);

        if (startsWith.length == 1) {
            boolean formatted = true;

            File tmp = startsWith[0];

            Scanner scTmp = new Scanner(new FileInputStream(tmp));

            String next = scTmp.next();
            String[] split = next.split(CSV_SEPARATOR);

            if (split.length > 0) {
                try {
                    Double.parseDouble(split[0]);
                    formatted = false;
                } catch (NumberFormatException ex) {
                }
            }

            //Teoricamente c'è ne solo uno.
            this.managedDataset = DataSet.createFromFile(startsWith[0].getAbsolutePath(), inputCount, outputCount, CSV_SEPARATOR, formatted);
        } else {
            throw new IOException("Errore ricerca dataset fisico");
        }

    }

    public double getNetworkError() {
        double error = 0.0;

        if (this.managedNeuralNetwork.getLearningRule() instanceof SupervisedLearning) {
            error = ((SupervisedLearning) this.managedNeuralNetwork.getLearningRule()).getTotalNetworkError();
        }

        return error;
    }

    public void saveNetwork(int neuralID) {
        this.managedNeuralNetwork.save(this.networksFileManager.getNewFile(neuralID + NEURALNETWORK_FILE_EXTENSION).getAbsolutePath());
    }

    public void saveDataset(int datasetID) {
        this.managedDataset.saveAsTxt(this.datasetsFileManager.getNewFile(datasetID + DATASET_FILE_EXTENSION).getAbsolutePath(), CSV_SEPARATOR);
    }

    public void setInLayers(int inLayers) {
        this.inLayers = inLayers;
    }

    public void setHiddenLayers(int[] hiddenLayers) {
        this.hiddenLayers = hiddenLayers;
    }

    public void setOutLayers(int outLayers) {
        this.outLayers = outLayers;
    }

    public void setTransferFunctionType(TransferFunctionType transferFunctionType) {
        this.transferFunctionType = transferFunctionType;
    }

    public void setTransferFunctionType(String transferFunctionTypeName) {
        this.transferFunctionType = TransferFunctionType.valueOf(transferFunctionTypeName);
    }

    public void setLearningRule(LearningRule learningRule) {
        this.learningRule = learningRule;
    }

    public void setLearningRule(String learningRuleName) {
        switch (learningRuleName) {
            case "MomentumBackpropagation":
                this.learningRule = new MomentumBackpropagation();
                break;
            case "ResilientPropagation":
                this.learningRule = new ResilientPropagation();
                break;
        }
    }

    public void setLearningRate(double rate) {
        if (this.learningRule != null && learningRule instanceof IterativeLearning) {
            IterativeLearning lr = (IterativeLearning) learningRule;
            lr.setLearningRate(rate);
        }
    }

    public void setMaxError(double error) {
        if (this.learningRule != null && learningRule instanceof SupervisedLearning) {
            SupervisedLearning lr = (SupervisedLearning) learningRule;
            lr.setMaxError(error);
        }
    }

    public void setMaxErrorFunction(String functionName) {
        if (this.learningRule != null && learningRule instanceof SupervisedLearning) {
            SupervisedLearning lr = (SupervisedLearning) learningRule;
            switch (functionName) {
                case "MeanSquaredError":
                    lr.setErrorFunction(new MeanSquaredError());
                    break;
            }
        }
    }

    public void setColorMode(ColorMode colorMode) {
        this.colorMode = colorMode;
    }

    public void setColorMode(String colorMode) {
        this.colorMode = ColorMode.valueOf(colorMode);
    }

    public boolean addPlugin(PluginBase e) {
        return plugins.add(e);
    }

    public boolean addPlugin(String pluginName) {
        switch (pluginName) {
            case "ImageRecognitionPlugin":
                plugins.add(new ImageRecognitionPlugin(new Dimension(width, height), colorMode));
            default:
                return false;
        }
    }

    public void addPlugins(String[] pluginNames) {
        for (String pluginName : pluginNames) {
            addPlugin(pluginName);
        }
    }

    public void clearPlugins() {
        plugins.clear();
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public void setDefaultMaxIterations() {
        if (this.learningRule != null && learningRule instanceof IterativeLearning) {
            IterativeLearning lr = (IterativeLearning) learningRule;
            lr.setMaxIterations(Integer.MAX_VALUE);
        }
    }

    public void setIterations(int it) {
        if (this.learningRule != null && learningRule instanceof IterativeLearning) {
            IterativeLearning lr = (IterativeLearning) learningRule;
            lr.setMaxIterations(it);
        }
    }

    public void setManagedNeuralNetwork(NeuralNetwork managedNeuralNetwork) {
        this.managedNeuralNetwork = managedNeuralNetwork;
    }

    public void setManagedDataset(DataSet managedDataset) {
        this.managedDataset = managedDataset;
    }

    public void updateManagedDataset(DataSet update) {
        if (managedDataset != null) {
            managedDataset.addAll(update.getRows());
        }
    }

}
