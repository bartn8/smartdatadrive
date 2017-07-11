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
package com.model.neural.analize;

import com.model.db.table.tables.wrapper.WrapperFiltro;
import com.model.db.table.tables.wrapper.WrapperPreset;
import com.model.db.table.tables.wrapper.WrapperPresetFiltroLink;
import com.model.db.table.tables.wrapper.WrapperRete;
import com.model.neural.NeuralNetworkManager;
import com.model.neural.image.map.ImageFilters;
import com.model.protocol.request.wrapper.Image64Wrapper;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class ImageAnalyzer {

    private static final Logger LOG = Logger.getLogger(ImageAnalyzer.class.getName());

    private final Image64Wrapper image64;
    private final ArrayList<WrapperPreset> presets;
    private ArrayList<WrapperFiltro> filtri;
    private final ArrayList<WrapperPresetFiltroLink> links;
    private WrapperRete rete;
    private NeuralNetworkManager mng;
    ImageFilters parseFilter;

    private double riscontro;

    public ImageAnalyzer(Image64Wrapper image64, ArrayList<WrapperPreset> presets, ArrayList<WrapperFiltro> filtri, ArrayList<WrapperPresetFiltroLink> links) {
        this.image64 = image64;
        this.riscontro = 0;
        this.presets = presets;
        this.filtri = new ArrayList<>(filtri);
        this.links = new ArrayList<>(links);
        parseFilter = new ImageFilters();
    }

    public void initNeuralNetworkManager(){
        mng = new NeuralNetworkManager();
        mng.initIO();
    }
    
    public void loadNetwork() throws IOException {
        
        mng.loadNetwork(rete.getID());
    }

    public void setNetwork(WrapperRete rete) {
        this.rete = rete;
    }

    private WrapperPreset filtraPreset() {
        WrapperPreset[] toArray = presets.stream()
                .filter((p -> p.getID() == rete.getPresetID()))
                .toArray((a) -> new WrapperPreset[a]);
        return toArray[0];
    }

    private ArrayList<WrapperFiltro> filtraFiltri(WrapperPreset preset) {
        ArrayList<WrapperFiltro> filtriFiltrati = new ArrayList<>();
        for (WrapperPresetFiltroLink link : links) {
            if (link.getPresetID() == preset.getID()) {
                for (WrapperFiltro filtro : filtri) {
                    if (filtro.getID() == link.getFilterID()) {
                        filtriFiltrati.add(filtro);
                    }
                }
            }
        }
        return filtriFiltrati;
    }

    public void calculate() {
        WrapperPreset preset = filtraPreset();
        ArrayList<WrapperFiltro> filtraFiltri = filtraFiltri(preset);

        BufferedImage processImage = image64.getImage();

        for (WrapperFiltro filtro : filtraFiltri) {
            try {
                processImage = parseFilter.processImage(filtro.getNome(), processImage);
            } catch (Exception ex) {
                LOG.log(Level.INFO, "Errore Applicazione filtro", ex);
            }
        }

        double[] result = null;

        if (processImage != null) {
            result = mng.recognizeImage(processImage);
        }

        if (result != null) {
            if (result.length > 0) {
                riscontro = result[0];
                return;
            }
        }
        riscontro = 0;
    }

    public double getRiscontro() {
        return riscontro;
    }



}

//        int imageWidth = image.getWidth();
//        int imageHeight = image.getHeight();
//
//        ColorMode colorMode = ColorMode.valueOf(preset.getColorMode());
//        int presetWidth = preset.getWidth();
//        int presetHeight = preset.getHeight();
//
//        double divWidth = imageWidth / (double) presetWidth;
//        double divHeight = imageHeight / (double) presetHeight;
//
//        double result = 0;
//
//        outFor:
//        for (int i = 1; i <= 3; i++) {
//            int subWidth = imageWidth / i;
//            int subHeight = imageHeight / i;
//
//            for (int y = 0; y < imageHeight; y += subHeight) {
//                for (int x = 0; x < imageWidth; x += subWidth) {
//                    
//                    Image crop = image.crop(x, y, imageWidth, imageHeight);
//                    crop = ImageSampler.downSampleImage(new Dimension(presetWidth, presetHeight), crop);
//
//                    FractionRgbData fractionRgbData = new FractionRgbData(crop);
//                    double[] rgbData;
//
//                    if ((colorMode == ColorMode.COLOR_RGB) || (colorMode == ColorMode.COLOR_HSL)) {
//                        rgbData = fractionRgbData.getFlattenedRgbValues();
//                    } else {
//                        rgbData = convertRgbInputToBinaryBlackAndWhite(fractionRgbData.getFlattenedRgbValues());
//                    }
//
//                    double subResult;
//
//                    try {
//                        //Test
//                        subResult = mng.test(rgbData)[0];
//                    } catch (Exception ex) {
//                        subResult = 0;
//                    }
//
//                    if (subResult > result) {
//                        result = subResult;
//                    }
//
//                    if (result > 0.9) {
//                        break outFor;
//                    }
//                }
//            }
//        }
//        riscontro = result;
