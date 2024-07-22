const ort = require("onnxruntime-node");
const path = require("path");
// const { performance } = require("node:perf_hooks");

var session;

(async () => {
    session = await ort.InferenceSession.create(
        path.join(__dirname, "/../../public/efficientnet_v2_s_quickdraw.onnx"),
        { graphOptimizationLevel: "all" }
    );
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
