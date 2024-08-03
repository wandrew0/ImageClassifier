const express = require("express");
const recaptcha_controller = require("./../controllers/recaptcha_controller");

const router = express.Router();

router.route("/verify").post(recaptcha_controller.verify);

module.exports = router;
