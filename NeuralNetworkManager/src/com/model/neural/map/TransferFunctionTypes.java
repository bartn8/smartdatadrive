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
package com.model.neural.map;

import java.util.HashMap;
import org.neuroph.util.TransferFunctionType;

/**
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
public class TransferFunctionTypes {
        private final HashMap<String, TransferFunctionType> types;

    public TransferFunctionTypes() {
        types = new HashMap<>();
    }
    
    public void init(){
        types.put("Linear", TransferFunctionType.LINEAR);
        types.put("Linear", TransferFunctionType.LINEAR);
        
    }
}
