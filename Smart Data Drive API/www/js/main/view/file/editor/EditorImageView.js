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

//Basato su un bel canvas grosso.
//Ogni immagine di sfondo sarà processata e ridimensionata
class EditorImageView extends View {
    constructor($this) {
        super($this);

        var windowWidth = $this.innerWidth() - 10;
        var windowHeight = $this.innerHeight() - 10;

        var minWidth = 720;
        var minHeight = 480;

        var width = Math.max(minWidth, windowWidth);
        var height = Math.max(minHeight, windowHeight);

        this.param = {
            width: width,
            height: height,
            aspect: width / height
        };

        this.imageParam = {scale: 1.0};

        this.enabled = true;
        this.capturing = false;
        this.lineCounter = 0;

        this.points = new Array();
        this.pointer = 0;

        //tmp drawing
        this.tmpPoints = new Array();
        this.tmpPointer = 0;

        this.diameter = 5;
        this.color = "#cf0";
    }

    updateView() {
        this.$this.empty();

        var $row = $("<div class=\"row\"><div class=\"col-md-12\"><canvas class=\"editorImageViewCanvas\" width=\"" + this.param.width + "\" height=\"" + this.param.height + "\">Aggiorna sto browser maledetto</canvas></div></div></div>");

        this.$this.append($row);
    }

    get $canvas() {
        return this.$this.find("canvas");
    }

    clearTmpDrawing() {
        this.$canvas.removeLayerGroup("htmp").drawLayers();
        this.tmpPoints = new Array();
        this.tmpPointer = 0;
    }

    clear() {
        this.$canvas.removeLayerGroup("highlighter").drawLayers();
        this.points = new Array();
        this.pointer = 0;
    }

    mousedown(e) {
        if (!this.enabled) {
            return;
        }

        var x = e.pageX - this.$canvas.offset().left;
        var y = e.pageY - this.$canvas.offset().top;

        this.capturing = true;
        this.addPoint(x, y);
        this.addTmpPoint(x, y);
        this.tmpDraw(true);
    }

    mousemove(e) {
        if (!this.enabled) {
            return;
        }
        if (this.capturing) {
            var x = e.pageX - this.$canvas.offset().left;
            var y = e.pageY - this.$canvas.offset().top;

            this.addPoint(x, y);
            this.addTmpPoint(x, y);
            this.tmpDraw(false);
        }
    }

    mouseleave(e) {
        if (!this.enabled) {
            return;
        }
        this.capturing = false;
        this.clearTmpDrawing();
        this.draw();
        this.lineCounter++;
    }

    mouseup(e) {
        if (!this.enabled) {
            return;
        }
        this.capturing = false;
        this.clearTmpDrawing();
        this.draw();
        this.lineCounter++;
    }

    addPoint(x, y) {
        this.points.push({x: x, y: y, dm: this.diameter});
    }

    addTmpPoint(x, y) {
        this.tmpPoints.push({x: x, y: y});
    }

    tmpDraw(firstMove) {
        if (!this.enabled) {
            return;
        }
        for (var i = this.tmpPointer; i < this.tmpPoints.length; i++) {
            if (!firstMove) {
                this.$canvas.drawLine({
                    layer: true,
                    name: "tmpline",
                    groups: ["htmp", "highlighter"],
                    strokeStyle: '#cf0',
                    strokeWidth: this.diameter,
                    rounded: true,
                    opacity: 0.1,
                    x1: this.tmpPoints[i - 1].x, y1: this.tmpPoints[i - 1].y,
                    x2: this.tmpPoints[i].x, y2: this.tmpPoints[i].y
                });
            } else {
                this.$canvas.drawArc({
                    layer: true,
                    name: "tmparc",
                    groups: ["htmp", "highlighter"],
                    fillStyle: '#cf0',
                    opacity: 0.5,
                    radius: this.diameter / 2,
                    x: this.tmpPoints[i].x, y: this.tmpPoints[i].y
                });
            }
        }
        this.tmpPointer = this.tmpPoints.length;
    }

    draw() {
        if (!this.enabled) {
            return;
        }
        var line = new Object();
        line["layer"] = true;
        line["name"] = "hline" + this.lineCounter;
        line["groups"] = ["hlines", "highlighter"];
        line["strokeStyle"] = "#cf0";
        line["strokeWidth"] = this.diameter;
        line["rounded"] = true;
        line["opacity"] = 0.5;

        for (var i = this.pointer, k = 1; i < this.points.length - 1; i++, k++) {
            line["x" + k] = this.points[i].x;
            line["y" + k] = this.points[i].y;
            line["x" + (k + 1)] = this.points[i + 1].x;
            line["y" + (k + 1)] = this.points[i + 1].y;
        }

        this.$canvas.drawLine(line);

        this.pointer = this.points.length;
    }

    crop() {
        //Verifico che posso fare il crop.
        if (this.points.length > 0) {
            //Ricerca punto massimo e punto minimo.
            var min = {
                x: this.points[0].x,
                y: this.points[0].y
            };

            var max = {
                x: this.points[0].x,
                y: this.points[0].y
            };

            for (var i = 0; i < this.points.length; i++) {
                var point = this.points[i];
                if (min.x > point.x) {
                    min.x = point.x;
                }
                if (min.y > point.y) {
                    min.y = point.y;
                }
                if (max.x < point.x) {
                    max.x = point.x;
                }
                if (max.y < point.y) {
                    max.y = point.y;
                }
            }

            //Riporto a grandezza la selezione
            min.x /= this.imageParam.scale;
            min.y /= this.imageParam.scale;
            max.x /= this.imageParam.scale;
            max.y /= this.imageParam.scale;

            //Ricavo il rettangolo del crop.
            var rectWidth = (max.x - min.x);
            var rectHeight = (max.y - min.y);

            //Resize del canvas in modo che calzi il crop
            this.resize(rectWidth, rectHeight);

            //Disegno il crop.
            this.$canvas.removeLayer("background").drawLayers();
            this.$canvas.drawImage({
                layer: true,
                name: "background",
                source: this.imageParam.src,
                x: 0,
                y: 0,
                fromCenter: false,
                sWidth: rectWidth,
                sHeight: rectHeight,
                sx: min.x,
                sy: min.y
            });

            //Verranno persi anche points!
            this.clear();

            return this.$canvas.getCanvasImage('png');
        } else {
            //Resize del canvas in modo che calzi l' immagine
            this.resize(this.imageParam.width, this.imageParam.height);

            //Disegno il crop.
            this.$canvas.removeLayer("background").drawLayers();
            this.$canvas.drawImage({
                layer: true,
                name: "background",
                source: this.imageParam.src,
                x: 0,
                y: 0,
                fromCenter: false
            });

            //Verranno persi anche points!
            this.clear();

            return this.$canvas.getCanvasImage('png');
        }
    }

    setImage(image) {
        //Eliminazione immagine precedente.
        this.$canvas.removeLayer("background").drawLayers();

        var imageJS = new Image();

        var onLoadContext = {
            context: this,
            imageJS: imageJS,
            onload: function () {

                var imageParam = {
                    scale: 1.0,
                    width: this.imageJS.width,
                    height: this.imageJS.height,
                    src: imageJS.src
                };

                this.context.imageParam = imageParam;

                //Ricavo i parametri.
                if (this.context.param.width >= imageParam.width) {//Confronto le dimensioni per evitare di sgranare.
                    if (this.context.param.height >= imageParam.height) {//Caso favorevole: centro e disegno
                        this.context.imageParam.xOffset = 0;
                        this.context.imageParam.yOffset = 0;
                    } else {//Riduzione altezza fino a dim canvas (rispettando aspect)
                        var diffHeight = this.context.imageParam.height - this.context.param.height;

                        this.context.imageParam.scale -= (diffHeight / this.context.imageParam.height);
                        this.context.imageParam.xOffset = this.context.imageParam.width * (1 - this.context.imageParam.scale) / 2;
                        this.context.imageParam.yOffset = this.context.imageParam.height * (1 - this.context.imageParam.scale) / 2;
                    }
                } else {
                    if (this.context.param.height >= imageParam.height) {//Riduzione della larghezza con uno scale.
                        var diffWidth = this.context.imageParam.width - this.context.param.width;

                        this.context.imageParam.scale -= (diffWidth / this.context.imageParam.width);
                        this.context.imageParam.xOffset = this.context.imageParam.width * (1 - this.context.imageParam.scale) / 2;
                        this.context.imageParam.yOffset = this.context.imageParam.height * (1 - this.context.imageParam.scale) / 2;
                    } else {
                        var diffHeight = this.context.imageParam.height - this.context.param.height;
                        var diffWidth = this.context.imageParam.width - this.context.param.width;

                        if (diffHeight >= diffWidth) {
                            this.context.imageParam.scale -= (diffHeight / this.context.imageParam.height);
                            this.context.imageParam.xOffset = this.context.imageParam.width * (1 - this.context.imageParam.scale) / 2;
                            this.context.imageParam.yOffset = this.context.imageParam.height * (1 - this.context.imageParam.scale) / 2;
                        } else {
                            this.context.imageParam.scale -= (diffWidth / this.context.imageParam.width);
                            this.context.imageParam.xOffset = this.context.imageParam.width * (1 - this.context.imageParam.scale) / 2;
                            this.context.imageParam.yOffset = this.context.imageParam.height * (1 - this.context.imageParam.scale) / 2;
                        }
                    }
                }

                this.context.imageParam.fromCenter = false;

                this.context.$canvas.drawImage({
                    layer: true,
                    name: "background",
                    source: this.context.imageParam.src,
                    x: 0 - this.context.imageParam.xOffset,
                    y: 0 - this.context.imageParam.yOffset,
                    fromCenter: this.context.imageParam.fromCenter,
                    scale: this.context.imageParam.scale
                });

            }
        };

        imageJS.src = image.src;
        imageJS.onload = $.proxy(onLoadContext.onload, onLoadContext);
    }

    resize(width, height) {
        this.$canvas.attr("width", width);
        this.$canvas.attr("height", height);
    }
}