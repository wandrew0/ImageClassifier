const express = require("express");
const quick_draw_controller = require("./../controllers/quick_draw_controller");

const router = express.Router();

router.route("/classify").post(quick_draw_controller.classify);

module.exports = router;
