<?php
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
namespace view\com;

/**
 * Description of ErrorView
 *
 * @author Luca Bartolomei bartn8@hotmail.it
 */
class HErrorView extends \view\View {

    private $errorMessage;

    function __construct() {
        parent::__construct();
    }

    function setErrorMessage($errorMessage) {
        $this->errorMessage = $errorMessage;
    }

    public function printPage() {
        ?>
        <!DOCTYPE HTML>
        <html>
            <head>
                <title>Errore!</title>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>Errore!</h1>
                <p><?php echo $this->errorMessage; ?></p>
            </body>
        </html>
        <?php
    }

}
