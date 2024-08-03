import React, {useEffect, useRef, useState} from "react";
import CanvasDraw from "@win11react/react-canvas-draw";
import {InferenceSession, Tensor, env} from "onnxruntime-web";
import {classOf} from "./QuickDrawClasses";

import "./DrawCanvas.css";

env.wasm.wasmPaths = "/static/";

const softmax = (logits) => {
    const maxLogit = Math.max(...logits);
    const exps = logits.map((x) => Math.exp(x - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b);
    return exps.map((x) => x / sumExps);
};

const getTopK = (arr, k) => {
    arr = Array.from(arr);
    const idxs = arr
        .map((value, index) => [value, index])
        .sort((a, b) => b[0] - a[0])
        .slice(0, k)
        .map((item) => item[1]);
    return idxs;
};

export default function DoodleLocal() {
    const canvasRef = useRef(null);
    const copyCanvasRef = useRef(null);
    const [copyCanvasContext, setCopyCanvasContext] = useState(null);

    const [result, setResult] = useState(null);
    const [session, setSession] = useState(null);
    const topK = 5;

    const [oLines, setOLines] = useState([]);

    useEffect(() => {
        (async () => {
            const session = await InferenceSession.create(
                "/efficientnet_v2_s_quickdraw.onnx",
                {graphOptimizationLevel: "all"}
            );
            setSession(session);
        })();
        const copy = copyCanvasRef.current.canvas.drawing.getContext("2d", {
            willReadFrequently: true,
        });
        setCopyCanvasContext(copy);
    }, []);

    const convertTo2DPixelArray = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
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
                    pixel.r = (255 - pixel.r) * (pixel.a / 255);
                    pixel.g = (255 - pixel.g) * (pixel.a / 255);
                    pixel.b = (255 - pixel.b) * (pixel.a / 255);
                }
                pixel.a = 255;
            }
        }

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
        const res = Array.from({length: containerHeight}, () =>
            Array.from({length: containerWidth}, () => ({
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
    };

    const convertToImageData = (context, pixelArray) => {
        var height = pixelArray.length;
        var width = pixelArray[0].length;
        const imageData = context.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const pixel = pixelArray[y][x];
                imageData.data[index] = pixel.r;
                imageData.data[index + 1] = pixel.g;
                imageData.data[index + 2] = pixel.b;
                imageData.data[index + 3] = pixel.a;
            }
        }
        return imageData;
    };

    const scale = 20;

    async function together() {
        const lines = canvasRef.current.lines;
        if (lines.length > 0 && !canvasRef.current.undoing) {
            const line = lines[lines.length - 1];
            if (oLines.length < lines.length) {
                const oLine = {
                    brushColor: line.brushColor,
                    brushRadius: line.brushRadius,
                    points: line.points,
                };
                oLines.push(oLine);
                setOLines(oLines);
            }
            line.brushRadius = 15;
            const points = line.points;
            line.points = [];
            for (let i = 0; i < points.length; i++) {
                if (points[i].x < 0) {
                    line.points.push(points[i]);
                } else {
                    line.points.push({
                        x: points[i].x - 560 * 9,
                        y: points[i].y - 560 * 9,
                    });
                }
            }
        }
        if (canvasRef.current.undoing) {
            return;
        }
        const save = canvasRef.current.getSaveData();
        copyCanvasRef.current.loadSaveData(save, true);
        const raw = center(
            invert(
                convertTo2DPixelArray(
                    copyCanvasContext.getImageData(0, 0, 28, 28)
                )
            )
        );
        // console.log(raw);
        copyCanvasContext.putImageData(
            convertToImageData(copyCanvasContext, raw),
            0,
            0
        );
        // console.log(canvasRef.current.undoing);
        if (session === null) {
            return;
        }

        const tensor = new Float32Array(28 * 28);

        for (let i = 0; i < 28 * 28; i++) {
            tensor[i] = raw[Math.floor(i / 28)][i % 28].r / 255.0;
        }

        const input = new Tensor("float32", tensor, [1, 1, 28, 28]);
        const feeds = {input: input};

        const start = performance.now();
        const output = await session.run(feeds);
        const end = performance.now();

        const logits = output[Object.keys(output)[0]].data;
        const probs = softmax(logits);

        const topKIndices = getTopK(probs, topK);

        const resultData = topKIndices.map((idx) => ({
            class: classOf(idx),
            prob: (probs[idx] * 100).toFixed(2),
        }));

        setResult({time: (end - start).toFixed(2), resultData});
    }

    const undo = () => {
        const tLines = canvasRef.current.lines;
        canvasRef.current.lines = oLines;
        // console.log(oLines, tLines);
        canvasRef.current.undoing = true;
        // console.log(canvasRef.current.lines.length);
        canvasRef.current.undo();
        // console.log(canvasRef.current.lines.length);
        setOLines(canvasRef.current.lines);
        canvasRef.current.lines = tLines;
        tLines.pop();
        canvasRef.current.undoing = false;
        // console.log(canvasRef.current.lines, tLines);
        together();
    };

    const styles = {
        buttons: {
            flex: "1 0 100%",
            textAlign: "center",
            margin: "5px 0px",
            alignItems: "center",
            justifyItems: "center",
            justifyContent: "center",
            leftAlign: "left",
        },
        divideLine: {
            width: "100%",
            height: "2px",
            border: "none",
        },
        container: {
            display: "flex",
            justifyContent: "space-evenly",
            justifyItems: "stretch",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            margin: "0%",
        },
        border: {
            width: "560px",
            margin: "0% 0%",
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
            zoomExtents: {min: 0.33, max: 3},
        },
    };

    return (
        <div>
            <hr style={styles.divideLine}/>
            <h4 className="blueHeader">
                Just doodle on the canvas below and see what AI recognizes in your sketch!
            </h4>
            <div align="center">
                <button
                    className="centered-button"
                    onClick={(e) => {
                        e.currentTarget.blur();
                        undo();
                    }}
                >
                    undo
                </button>
                <button

                    className="centered-button"
                    onClick={(e) => {
                        e.currentTarget.blur();
                        canvasRef.current.clear();
                        setOLines([]);
                        setResult(null);
                        together();
                    }}
                >
                    reset
                </button>
            </div>
            <div style={styles.container}>

                <div
                    style={{
                        height: "560px",
                        overflowY: "scroll",
                        whiteSpace: "nowrap",
                    }}
                >
                    {Array.apply(0, Array(345)).map(function (x, i) {
                        return (
                            <p style={{margin: "0px 0px"}}>{classOf(i)}</p>
                        );
                    })}
                </div>
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
                        disabled={true}
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
                {!session && (
                    <div className="result">
                        <p>downloading/loading model</p>
                    </div>
                )}
                {result && (
                    <div className="result">
                        <p className="time">
                            Local Inference Time: {result.time} ms
                        </p>
                        <table className="result-table">
                            <thead>
                            <tr>
                                <th>Class</th>
                                <th>Probability</th>
                            </tr>
                            </thead>
                            <tbody>
                            {result.resultData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.class}</td>
                                    <td>{item.prob} %</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
