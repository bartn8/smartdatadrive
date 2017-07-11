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
package com.model.neural.image.map;

import java.awt.image.BufferedImage;
import java.util.HashMap;
import org.neuroph.imgrec.filter.ImageFilter;
import org.neuroph.imgrec.filter.impl.*;

/**
 *
 * @author luca
 */
public class ImageFilters {

    private final HashMap<String, ImageFilter> filters;

    public ImageFilters() {
        filters = new HashMap<>();
    }

    public void init() {
        filters.put("AdaptiveThresholdBinarizeFilter", new AdaptiveThresholdBinarizeFilter());
        filters.put("DCTgrayscale", new DCTgrayscale());
        filters.put("DenoiseDCTFilter", new DenoiseDCTFilter());
        filters.put("Dilation", new Dilation());
        filters.put("EdgeDetection", new EdgeDetection());
        filters.put("EraseBlackBorderFilter", new EraseBlackBorderFilter());
        filters.put("GaussianBluring", new GaussianBluring());
        filters.put("GaussianNoise", new GaussianNoise());
        //filters.put("GenericConvolution", new GenericConvolution());
        filters.put("GrayscaleFilter", new GrayscaleFilter());
        filters.put("GuoHallThiningFilter", new GuoHallThiningFilter());
        filters.put("HistogramEqualizationFilter", new HistogramEqualizationFilter());
        filters.put("LetterSegmentationFilter", new LetterSegmentationFilter());
        filters.put("LetterSeparationFilter", new LetterSeparationFilter());
        filters.put("MaskSegmentationFilter", new MaskSegmentationFilter());
        filters.put("MeanFilter", new MeanFilter());
        filters.put("MedianFilter", new MedianFilter());
        filters.put("NormalizationFilter", new NormalizationFilter());
        filters.put("OCRCropImage", new OCRCropImage());
        filters.put("OCRSeparationFilter", new OCRSeparationFilter());
        filters.put("OtsuBinarizeFilter", new OtsuBinarizeFilter());
        filters.put("SobelEdgeDetection", new SobelEdgeDetection());
        filters.put("UnsharpMaskingFilter", new UnsharpMaskingFilter());
        filters.put("ZhangSuenThinFilter", new ZhangSuenThinFilter());
    }

    public BufferedImage processImage(String filterName, BufferedImage image) throws Exception {
        ImageFilter filtro = filters.get(filterName);
        if (filtro != null) {
            return filtro.processImage(image);
        }
        throw new Exception("Filtro non presente");
    }

}
