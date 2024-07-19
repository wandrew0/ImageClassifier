import React, { useEffect, useRef, useState } from "react";
import "react-canvas-paint/dist/index.css";
import CanvasDraw from "@win11react/react-canvas-draw";

export default function DrawCanvas() {
    const canvasRef = useRef(null);
    const copyCanvasRef = useRef(null);
    const [canvasContext, setCanvasContext] = useState(null);
    const [copyCanvasContext, setCopyCanvasContext] = useState(null);
    const imageArray = useRef(null);

    useEffect(() => {
        const context = canvasRef.current.canvas.drawing.getContext("2d", {
            willReadFrequently: true, // doesn't work
        });
        setCanvasContext(context);
        const copy = copyCanvasRef.current.canvas.drawing.getContext("2d", {
            willReadFrequently: true, // doesn't work
        });
        setCopyCanvasContext(copy);
        // copy.scale(20, 20);
        // together();
    }, []);

    const convertTo2DPixelArray = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
        // console.log("width:" + width + ", height:" + height);
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
                    a: data[index + 3],
                };
                row.push(pixel);
            }
            pixelArray.push(row);
        }
        return pixelArray;
    };

    const invert = (arr) => {
        const height = arr.length;
        const width = arr[0].length;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixel = arr[y][x];
                if (pixel.a !== 0) {
                    // console.log(pixel);
                    pixel.r = (255 - pixel.r) * (pixel.a / 255);
                    pixel.g = (255 - pixel.g) * (pixel.a / 255);
                    pixel.b = (255 - pixel.b) * (pixel.a / 255);
                }
                pixel.a = 255;
            }
        }
        // console.log(arr);

        return arr;
    };

    const center = (pixels) => {
        const containerHeight = 28;
        const containerWidth = 28;
        const height = pixels.length;
        const width = pixels[0].length;

        // Initialize variables to find the bounding box
        let minX = width,
            maxX = 0,
            minY = height,
            maxY = 0;

        // Determine the bounding box of non-black pixels
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixel = pixels[y][x];
                if (pixel.r !== 0 || pixel.g !== 0 || pixel.b !== 0) {
                    // Non-black pixel
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        // Check if there were any non-black pixels
        if (minX > maxX || minY > maxY) {
            return pixels; // Return original or an empty array as needed
        }

        // Extract the non-black bounding box region
        const subWidth = maxX - minX + 1;
        const subHeight = maxY - minY + 1;
        const startRow = Math.floor((containerHeight - subHeight) / 2);
        const startCol = Math.floor((containerWidth - subWidth) / 2);
        const res = Array.from({ length: containerHeight }, () =>
            Array.from({ length: containerWidth }, () => ({
                r: 0,
                g: 0,
                b: 0,
                a: 255,
            }))
        );
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                res[startRow + y - minY][startCol + x - minX] = pixels[y][x];
            }
        }
        return res;
        // const subArray = Array.from({ length: subHeight }, () =>
        //     Array.from({ length: subWidth }, () => ({
        //         r: 0,
        //         g: 0,
        //         b: 0,
        //         a: 255,
        //     }))
        // );

        // for (let y = minY; y <= maxY; y++) {
        //     for (let x = minX; x <= maxX; x++) {
        //         subArray[y - minY][x - minX] = pixels[y][x];
        //     }
        // }

        // // Create a new centered array
        // const centeredArray = Array.from({ length: containerHeight }, () =>
        //     Array.from({ length: containerWidth }, () => ({
        //         r: 0,
        //         g: 0,
        //         b: 0,
        //         a: 255,
        //     }))
        // );

        // // Calculate start positions to center the subArray
        // const startRow = Math.floor((containerHeight - subHeight) / 2);
        // const startCol = Math.floor((containerWidth - subWidth) / 2);

        // // Place the subArray into the centeredArray
        // for (let y = 0; y < subHeight; y++) {
        //     for (let x = 0; x < subWidth; x++) {
        //         centeredArray[startRow + y][startCol + x] = subArray[y][x];
        //     }
        // }

        // return centeredArray;
    };

    const convertToImageData = (context, pixelArray) => {
        var height = pixelArray.length;
        var width = pixelArray[0].length;
        // console.log("width:" + width + ", height:" + height);
        const imageData = context.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const pixel = pixelArray[y][x];
                imageData.data[index] = pixel.r; // R value
                imageData.data[index + 1] = pixel.g; // G value
                imageData.data[index + 2] = pixel.b; // B value
                imageData.data[index + 3] = pixel.a; // A value
            }
        }
        return imageData;
    };

    const scale = 20;

    function together() {
        const lines = canvasRef.current.lines;
        if (lines.length > 0) {
            const line = lines[lines.length - 1];
            line.brushRadius = 20;
            const points = line.points;
            line.points = [];
            for (let i = 0; i < points.length; i++) {
                line.points.push({
                    x: points[i].x - 560 * 9,
                    y: points[i].y - 560 * 9,
                });
            }
            // console.log(line.points);
        }
        const save = canvasRef.current.getSaveData();
        copyCanvasRef.current.loadSaveData(save, true);
        copyCanvasContext.putImageData(
            convertToImageData(
                copyCanvasContext,
                center(
                    invert(
                        convertTo2DPixelArray(
                            copyCanvasContext.getImageData(0, 0, 28, 28)
                        )
                    )
                )
            ),
            0,
            0
        );
    }

    const styles = {
        buttons: {
            flex: "1 0 100%",
        },
        divideLine: {
            width: "100%",
            height: "2px",
            border: "none",
        },
        container: {
            display: "flex",
            justifyContent: "center",
            justifyItems: "stretch",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
        },
        border: {
            width: "560px",
            margin: "5% 5%",
        },
        canvas: {
            onChange: null,
            loadTimeOffset: 0,
            lazyRadius: 2,
            brushRadius: 5,
            brushColor: "#000000",
            catenaryColor: "#0a0302",
            gridColor: "rgba(150,150,150,.2)",
            hideGrid: false,
            canvasWidth: 560,
            canvasHeight: 560,
            disabled: false,
            imgSrc: "",
            saveData: null,
            immediateLoading: false,
            hideInterface: false,
            gridSizeX: 10,
            gridSizeY: 10,
            gridLineWidth: 1,
            hideGridX: false,
            hideGridY: false,
            enablePanAndZoom: false,
            mouseZoomFactor: 0.01,
            zoomExtents: { min: 0.33, max: 3 },
        },
    };

    return (
        <div>
            <hr style={styles.header} />
            <h4 align="center">
                Please draw a letter or number on the canvas below
            </h4>
            <div style={styles.container}>
                <div style={styles.border}>
                    <CanvasDraw
                        ref={canvasRef}
                        onChange={together}
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
                <div>
                    <CanvasDraw
                        style={{
                            transform: `scale(${scale})`,
                            imageRendering: "pixelated",
                            marginLeft: `${(560 - 28) / 2}px`,
                            marginRight: `${(560 - 28) / 2}px`,
                        }}
                        // style={{  }}
                        ref={copyCanvasRef}
                        onChange={null}
                        loadTimeOffset={styles.canvas.loadTimeOffset}
                        lazyRadius={0}
                        brushRadius={0}
                        brushColor={styles.canvas.brushColor}
                        catenaryColor={styles.canvas.catenaryColor}
                        gridColor={styles.canvas.gridColor}
                        hideGrid={true}
                        canvasWidth={28}
                        canvasHeight={28}
                        disabled={false}
                        imgSrc={styles.canvas.imgSrc}
                        immediateLoading={styles.canvas.immediateLoading}
                        hideInterface={styles.canvas.hideInterface}
                        gridSizeX={5}
                        gridSizeY={5}
                        gridLineWidth={styles.canvas.gridLineWidth}
                        hideGridX={false}
                        hideGridY={false}
                        enablePanAndZoom={styles.canvas.enablePanAndZoom}
                        mouseZoomFactor={styles.canvas.mouseZoomFactor}
                        zoomExtents={styles.canvas.zoomExtents}
                    />
                </div>
                <div className="button-container" style={styles.buttons}>
                    <button
                        className="centered-button"
                        onClick={() => {
                            canvasRef.current.eraseAll();
                        }}
                    >
                        reset
                    </button>
                    {/* <button
                        className="centered-button"
                        onClick={() => {
                            const lines = canvasRef.current.lines;
                            for (let i = 0; i < lines.length; i++) {
                                const line = lines[i];
                                line.brushRadius = 5;
                                const points = line.points;
                                line.points = [];
                                for (let i = 0; i < points.length; i++) {
                                    line.points.push({
                                        x: points[i].x + 560 * 9,
                                        y: points[i].y + 560 * 9,
                                    });
                                }
                            }
                            canvasRef.current.undo();
                            together();
                        }}
                    >
                        undo last
                    </button> */}
                    {/* <button className="centered-button" onClick={handleCapture}>
                        capture
                    </button>
                    <button className="centered-button" onClick={handleRender}>
                        render below
                    </button> */}
                </div>
            </div>
        </div>
    );
}
