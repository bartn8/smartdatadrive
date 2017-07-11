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
package com.model.protocol.request.wrapper;

import java.awt.image.BufferedImage;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class Image64Wrapper {

    private String mime;
    private BufferedImage image;

    public Image64Wrapper() {
    }

    public Image64Wrapper(String mime, BufferedImage image) {
        this.mime = mime;
        this.image = image;
    }

    /**
     * Get the value of image
     *
     * @return the value of image
     */
    public BufferedImage getImage() {
        return image;
    }

    /**
     * Set the value of image
     *
     * @param image new value of image
     */
    public void setImage(BufferedImage image) {
        this.image = image;
    }

    /**
     * Get the value of mime
     *
     * @return the value of mime
     */
    public String getMime() {
        return mime;
    }

    /**
     * Set the value of mime
     *
     * @param mime new value of mime
     */
    public void setMime(String mime) {
        this.mime = mime;
    }

}
