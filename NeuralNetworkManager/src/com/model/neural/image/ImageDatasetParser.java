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
package com.model.neural.image;

import com.model.db.table.tables.wrapper.WrapperPreset;
import com.model.protocol.request.wrapper.Image64Wrapper;
import com.model.protocol.request.wrapper.Point64Wrapper;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import org.neuroph.core.data.DataSet;
import org.neuroph.core.data.DataSetRow;
import org.neuroph.imgrec.ColorMode;
import org.neuroph.imgrec.FractionRgbData;
import static org.neuroph.imgrec.FractionRgbData.convertRgbInputToBinaryBlackAndWhite;
import org.neuroph.imgrec.ImageSampler;
import org.neuroph.imgrec.image.Dimension;
import org.neuroph.imgrec.image.Image;
import org.neuroph.imgrec.image.ImageJ2SE;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class ImageDatasetParser {

    public static BufferedImage removeAlpha(BufferedImage image) {
        BufferedImage copy = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = copy.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, copy.getWidth(), copy.getHeight());
        g2d.drawImage(image, 0, 0, null);
        g2d.dispose();
        return copy;
    }

    private final Image64Wrapper image;
    private final List<Point64Wrapper> points;
    private final WrapperPreset preset;
    private DataSet dataset;

    public ImageDatasetParser(Image64Wrapper image, List<Point64Wrapper> points, WrapperPreset preset) {
        this.image = image;
        this.points = points;
        this.preset = preset;
    }

    public void parse(boolean positive) {
        //Dati preset
        int presetWidth = preset.getWidth();
        int presetHeight = preset.getHeight();
        ColorMode colorMode = ColorMode.valueOf(preset.getColorMode());

        //Immagine
        BufferedImage bImage = this.image.getImage();
        
        int type = bImage.getType();

        switch (type) {
            case BufferedImage.TYPE_CUSTOM:
            case BufferedImage.TYPE_4BYTE_ABGR:
            case BufferedImage.TYPE_4BYTE_ABGR_PRE:
            case BufferedImage.TYPE_INT_ARGB:
            case BufferedImage.TYPE_INT_ARGB_PRE:
                bImage = removeAlpha(bImage);
        }

        ImageJ2SE imageJ2SE = new ImageJ2SE(bImage);

        //Resizing per rispettare preset.
        Image downSample = ImageSampler.downSampleImage(new Dimension(presetWidth, presetHeight), imageJ2SE);

        FractionRgbData fractionRgbDataGood = new FractionRgbData(downSample);

        int areaSize;
        double[] rgbDouble;

        if ((colorMode == ColorMode.COLOR_RGB) || (colorMode == ColorMode.COLOR_HSL)) {
            areaSize = presetWidth * presetHeight * 3;
            rgbDouble = fractionRgbDataGood.getFlattenedRgbValues();
        } else {
            areaSize = presetWidth * presetHeight;
            rgbDouble = convertRgbInputToBinaryBlackAndWhite(fractionRgbDataGood.getFlattenedRgbValues());
        }

        this.dataset = new DataSet(areaSize, 1);

        double tmp = positive ? 1 : 0;

        this.dataset.add(new DataSetRow(rgbDouble, new double[]{tmp}));
        this.dataset.setColumnNames(new String[0]);

        //Cerco i colori spazzatura.
        List<Integer> imageJunkColors = new ArrayList<>();
        Random rnd = new Random();

        if (points.size() > 0) {
            int lastPointIndex = points.size() - 1;

            for (int i = 0, k = 0; k < 8 && i < points.size(); k++, i = rnd.nextInt(lastPointIndex)) {
                Point64Wrapper point = points.get(i);
                int rgb = bImage.getRGB((int) point.getX(), (int) point.getY());

                if (!imageJunkColors.contains(rgb)) {
                    imageJunkColors.add(rgb);
                }
            }
        }

        for (int i = 0; i < 8; i++) {
            int rndX = rnd.nextInt(bImage.getWidth());
            int rndY = rnd.nextInt(bImage.getHeight());
            int rgb = bImage.getRGB(rndX, rndY);

            if (!imageJunkColors.contains(rgb)) {
                imageJunkColors.add(rgb);
            }
        }

        //Aggiunta dei colori junk.
        for (int i = 0; i < imageJunkColors.size(); i++) {
            int[] colorArray = new int[presetWidth * presetHeight];
            Arrays.fill(colorArray, imageJunkColors.get(i));

            BufferedImage imageColorJunk = new BufferedImage(presetWidth, presetHeight, bImage.getType());
            imageColorJunk.setRGB(0, 0, presetWidth, presetHeight, colorArray, 0, presetWidth);

            ImageJ2SE imageColorJunkJ2SE = new ImageJ2SE(imageColorJunk);
            FractionRgbData fractionRgbDataColorJunk = new FractionRgbData(imageColorJunkJ2SE);

            double[] colorJunkData;

            if ((colorMode == ColorMode.COLOR_RGB) || (colorMode == ColorMode.COLOR_HSL)) {
                colorJunkData = fractionRgbDataColorJunk.getFlattenedRgbValues();
            } else {
                colorJunkData = convertRgbInputToBinaryBlackAndWhite(fractionRgbDataColorJunk.getFlattenedRgbValues());
            }

            this.dataset.add(new DataSetRow(colorJunkData, new double[]{0}));
        }

    }

    public DataSet getDataset() {
        return dataset;
    }

}
