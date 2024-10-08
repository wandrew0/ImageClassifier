const ort = require("onnxruntime-node");
const path = require("path");
const fs = require("fs");
// const { performance } = require("node:perf_hooks");

var session;

(async () => {
    let filepath = path.join(
        __dirname,
        "/../../build/kaggleguy2_emnist_balanced.onnx"
    );
    if (!fs.existsSync(filepath)) {
        filepath = path.join(
            __dirname,
            "/../../public/kaggleguy2_emnist_balanced.onnx"
        );
    }
    session = await ort.InferenceSession.create(filepath, {
        graphOptimizationLevel: "all",
    });
})();

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const classify = async (input) => {
    const arr = new Float32Array(input);

    const tensor = new ort.Tensor("float32", arr, [1, 1, 28, 28]);

    const feeds = { input: tensor };

    const start = performance.now();
    const output = await session.run(feeds);
    // await timeout(0);
    const end = performance.now();

    const logits = output[Object.keys(output)[0]].data;

    return { logits, end, start };
};

exports.classify = classify;
