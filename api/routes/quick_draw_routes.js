const express = require("express");
const quick_draw_controller = require("./../controllers/quick_draw_controller");
const { protect } = require("./../controllers/recaptcha_controller");

const router = express.Router();

router.route("/classify").post(protect, quick_draw_controller.classify);

module.exports = router;
