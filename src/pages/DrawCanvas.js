import React, {useEffect, useRef, useState} from "react";
import 'react-canvas-paint/dist/index.css'
import CanvasDraw from "react-canvas-draw";

export default function DrawCanvas() {
    const canvasRef = useRef(null);
    const copyCanvasRef = useRef(null);
    const [capturedImageChange, setCapturedImageChange] = useState(false);
    const imageArray = useRef(null);

    const convertTo2DPixelArray = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
        console.log("width:" + width + ", height:" + height);
        const data = imageData.data;
        const pixelArray = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const pixel = {
                    r: data[index],
                    g: data[index + 1],
                    b: data[index + 2],
                    a: data[index + 3]
                };
                row.push(pixel);
            }
            pixelArray.push(row);
        }
        return pixelArray;

    };
    const convertToImageData = (context, pixelArray) => {
        var height = pixelArray.length;
        var width = pixelArray[0].length;
        console.log("width:" + width + ", height:" + height);
        const imageData = context.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const pixel = pixelArray[y][x];
                imageData.data[index] = pixel.r;     // R value
                imageData.data[index + 1] = pixel.g; // G value
                imageData.data[index + 2] = pixel.b; // B value
                imageData.data[index + 3] = pixel.a; // A value
            }
        }
        return imageData;
    }



    function handleCapture() {
        let canvasToCapture = canvasRef.current.canvas.drawing;
        let context = canvasToCapture.getContext("2d");
        let width = canvasToCapture.width;
        let height = canvasToCapture.height;
        let img = context.getImageData(0, 0, width, height);
        imageArray.current = convertTo2DPixelArray(img);
    }

    function handleRender() {
        console.log("inside render");
        console.log(imageArray.current);
        let context = copyCanvasRef.current.canvas.drawing.getContext("2d");
        let imageData = convertToImageData(context, imageArray.current);
        context.putImageData(imageData, 0, 0);
    }
    const styles = {
        divideLine: {
            width: '100%',
            height: '2px',
            border: 'none',
        },
        border: {
            width: '600px',
            margin: '20px auto',
        },
        canvas: {
            onChange: null,
            loadTimeOffset: 5,
            lazyRadius: 10,
            brushRadius: 1,
            brushColor: "#444",
            catenaryColor: "#0a0302",
            gridColor: "rgba(150,150,150,0.17)",
            hideGrid: false,
            canvasWidth: 600,
            canvasHeight: 500,
            disabled: false,
            imgSrc: "",
            saveData: null,
            immediateLoading: false,
            hideInterface: false,
            gridSizeX: 10,
            gridSizeY: 10,
            gridLineWidth: 0.5,
            hideGridX: false,
            hideGridY: false,
            enablePanAndZoom: false,
            mouseZoomFactor: 0.01,
            zoomExtents: {min: 0.33, max: 3},
        },

    }


    return (
        <div>
            <hr style={styles.header}/>
            <h4 align='center'>Please draw a letter or number on the canvas below</h4>
            <div style={styles.border}>
                <CanvasDraw
                    ref={canvasRef}
                    onChange={styles.canvas.onChange}
                    loadTimeOffset={styles.canvas.loadTimeOffset}
                    lazyRadius={styles.canvas.lazyRadius}
                    brushRadius={styles.canvas.brushRadius}
                    brushColor={styles.canvas.brushColor}
                    catenaryColor={styles.canvas.catenaryColor}
                    gridColor={styles.canvas.gridColor}
                    hideGrid={styles.canvas.hideGrid}
                    canvasWidth={styles.canvas.canvasWidth}
                    canvasHeight={styles.canvas.canvasHeight}
                    disabled={styles.canvas.disabled}
                    imgSrc={styles.canvas.imgSrc}
                    saveData={styles.canvas.saveData}

                    immediateLoading={styles.canvas.immediateLoading}
                    hideInterface={styles.canvas.hideInterface}
                    gridSizeX={styles.canvas.gridSizeX}
                    gridSizeY={styles.canvas.gridSizeY}
                    gridLineWidth={styles.canvas.gridLineWidth}
                    hideGridX={styles.canvas.hideGridX}
                    hideGridY={styles.canvas.hideGridY}
                    enablePanAndZoom={styles.canvas.enablePanAndZoom}
                    mouseZoomFactor={styles.canvas.mouseZoomFactor}
                    zoomExtents={styles.canvas.zoomExtents}
                />
            </div>
            <div className="button-container">
                <button className="centered-button" onClick={() => {
                    canvasRef.current.eraseAll()
                }}>reset
                </button>
                <button className="centered-button" onClick={() => {
                    canvasRef.current.undo()
                }}>undo last
                </button>
                <button className="centered-button" onClick={handleCapture}>capture</button>
                <button className="centered-button" onClick={handleRender}>render below</button>
            </div>
            <div style={styles.border}>
                <CanvasDraw
                    ref={copyCanvasRef}
                    onChange={styles.canvas.onChange}
                    loadTimeOffset={styles.canvas.loadTimeOffset}
                    lazyRadius={styles.canvas.lazyRadius}
                    brushRadius={styles.canvas.brushRadius}
                    brushColor={styles.canvas.brushColor}
                    catenaryColor={styles.canvas.catenaryColor}
                    gridColor={styles.canvas.gridColor}
                    hideGrid={styles.canvas.hideGrid}
                    canvasWidth={styles.canvas.canvasWidth}
                    canvasHeight={styles.canvas.canvasHeight}
                    disabled={true}
                    imgSrc={styles.canvas.imgSrc}
                    immediateLoading={styles.canvas.immediateLoading}
                    hideInterface={styles.canvas.hideInterface}
                    gridSizeX={styles.canvas.gridSizeX}
                    gridSizeY={styles.canvas.gridSizeY}
                    gridLineWidth={styles.canvas.gridLineWidth}
                    hideGridX={styles.canvas.hideGridX}
                    hideGridY={styles.canvas.hideGridY}
                    enablePanAndZoom={styles.canvas.enablePanAndZoom}
                    mouseZoomFactor={styles.canvas.mouseZoomFactor}
                    zoomExtents={styles.canvas.zoomExtents}
                />
                <div className="button-container">
                    <button className="centered-button" onClick={() => {
                        copyCanvasRef.current.eraseAll()
                    }}>reset
                    </button>
                </div>
            </div>


        </div>
    );
}

