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
package com.model.io;

import java.io.File;
import java.util.Arrays;
import java.util.List;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class RelativeFileManager {

    private final File folder;

    public RelativeFileManager(String folderName) {
        this.folder = new File(folderName);
    }

    public RelativeFileManager(File folder) {
        this.folder = folder;
    }

    public void init() {
        if (!this.folder.exists()) {
            this.folder.mkdirs();
        }
    }
    
    public File getNewFile(String fileName){
        return new File(folder, fileName);
    }
    
    public File[] startsWith(String fileName){
        File[] arrayFiles = folder.listFiles();
        List<File> listOfFiles = Arrays.asList(arrayFiles == null ? new File[0] : arrayFiles);
        return listOfFiles.stream().filter(f -> f.isFile()).filter(f -> f.getName().startsWith(fileName)).toArray(size -> new File[size]);
    }

    public File[] getAllFolders() {
        File[] arrayFiles = folder.listFiles();
        List<File> listOfFiles = Arrays.asList(arrayFiles == null ? new File[0] : arrayFiles);
        return listOfFiles.stream().filter(f -> f.isDirectory()).toArray(size -> new File[size]);
    }

    public File[] getAllFiles() {
        File[] arrayFiles = folder.listFiles();
        List<File> listOfFiles = Arrays.asList(arrayFiles == null ? new File[0] : arrayFiles);
        return listOfFiles.stream().filter(f -> f.isFile()).toArray(size -> new File[size]);
    }

}
