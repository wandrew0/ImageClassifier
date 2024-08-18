const express = require("express");
const emnistb_controller = require("../controllers/emnistb_controller");
const { protect } = require("./../controllers/recaptcha_controller");

const router = express.Router();

router.route("/classify").post(protect, emnistb_controller.classify);

module.exports = router;
