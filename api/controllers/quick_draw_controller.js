const model = require("../models/quick_draw_model");

exports.classify = async (req, res) => {
    // input body should be preprocessed into 1d array of floats in range 0.0 to 1.0 representing a 28x28 grayscale image.
    // batch size = 1
    // returns logits
    try {
        // console.log(req.body.input);
        if (!req.body.input) {
            throw new Error("missing input array");
        }
        if (!Array.isArray(req.body.input)) {
            throw new Error("input is not array");
        }
        const { logits, end, start } = await model.classify(req.body.input);
        res.status(200).json({
            status: "success",
            data: { logits: Array.from(logits), end, start },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};
