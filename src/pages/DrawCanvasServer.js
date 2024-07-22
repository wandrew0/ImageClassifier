import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "@win11react/react-canvas-draw";
// import { InferenceSession, Tensor, env } from "onnxruntime-web";
import { classOf } from "./QuickDrawClasses";

import "./DrawCanvas.css";

// env.wasm.wasmPaths = "/static/";

const callApi = async (path, body) => {
    const headers = { "Content-Type": "application/json" };

    const url = "http://" + window.location.hostname + ":3000" + path;

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    });

    return response;
};

const serverClassify = async (arr) => {
    const res = await callApi("/api/quickdraw/classify", { input: arr });
    const parsed = await res.json();

    const logits = parsed.data.logits;
    const end = parsed.data.end;
    const start = parsed.data.start;

    return { logits, end, start };
};

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

export default function DrawCanvasServer() {
    const canvasRef = useRef(null);
    const copyCanvasRef = useRef(null);
    // const [canvasContext, setCanvasContext] = useState(null);
    const [copyCanvasContext, setCopyCanvasContext] = useState(null);
    // const imageArray = useRef(null);

    const [result, setResult] = useState(null);
    // const [loading, setLoading] = useState(null);
    const [session, setSession] = useState(null);
    // const [tensor, setTensor] = useState(null);
    const topK = 5;

    useEffect(() => {
        // (async () => {
        //     const session = await InferenceSession.create(
        //         "/efficientnet_v2_s_quickdraw.onnx",
        //         { graphOptimizationLevel: "all" }
        //     );
        //     setSession(session);
        // })();
        const context = canvasRef.current.canvas.drawing.getContext("2d", {
            willReadFrequently: true,
        });
        // setCanvasContext(context);
        const copy = copyCanvasRef.current.canvas.drawing.getContext("2d", {
            willReadFrequently: true,
        });
        setCopyCanvasContext(copy);
        // const onPageLoad = () => {
        //     setTimeout(() => {
        //         canvasRef.current.eraseAll();
        //     }, 200);
        // };

        // // Check if the page has already loaded
        // if (document.readyState === "complete") {
        //     onPageLoad();
        // } else {
        //     window.addEventListener("load", onPageLoad, false);
        //     // Remove the event listener when component unmounts
        //     return () => window.removeEventListener("load", onPageLoad);
        // }
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
        // console.log("invert");
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

    async function together() {
        // rename to handleChange
        const lines = canvasRef.current.lines;
        if (lines.length > 0) {
            const line = lines[lines.length - 1];
            line.brushRadius = 15;
            const points = line.points;
            line.points = [];
            for (let i = 0; i < points.length; i++) {
                // if (i % 50 === 0 || points.length <= 3) {
                line.points.push({
                    x: points[i].x - 560 * 9,
                    y: points[i].y - 560 * 9,
                });
                // }
            }
            // console.log(line.points);
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

        const arr = [];

        for (let i = 0; i < 28 * 28; i++) {
            arr[i] = raw[Math.floor(i / 28)][i % 28].r / 255.0;
        }

        const { logits, end, start } = await serverClassify(arr);
        // console.log(logits);

        // const tensor = new Float32Array(28 * 28);

        // for (let i = 0; i < 28 * 28; i++) {
        //     tensor[i] = raw[Math.floor(i / 28)][i % 28].r / 255.0;
        // }

        // const input = new Tensor("float32", tensor, [1, 1, 28, 28]);
        // const feeds = { input: input };

        // const start = performance.now();
        // const output = await session.run(feeds);
        // const end = performance.now();

        // const logits = output[Object.keys(output)[0]].data;
        const probs = softmax(logits);

        const topKIndices = getTopK(probs, topK);

        const resultData = topKIndices.map((idx) => ({
            class: classOf(idx),
            prob: (probs[idx] * 100).toFixed(2),
        }));

        setResult({ time: (end - start).toFixed(2), resultData });
    }

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
                <div className="button-container" style={styles.buttons}>
                    <button
                        style={styles.buttons}
                        className="centered-button"
                        onClick={(e) => {
                            e.currentTarget.blur();
                            canvasRef.current.eraseAll();
                            setResult(null);
                        }}
                    >
                        reset
                    </button>
                </div>
                <div
                    style={{
                        height: "560px",
                        overflowY: "scroll",
                        whiteSpace: "nowrap",
                    }}
                >
                    {Array.apply(0, Array(345)).map(function (x, i) {
                        return (
                            <p style={{ margin: "0px 0px" }}>{classOf(i)}</p>
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
                {result && (
                    <div className="result">
                        <p className="time">
                            Server Inference Time: {result.time} ms
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
