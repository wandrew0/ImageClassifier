const express = require("express");
const emnistb_controller = require("../controllers/emnistb_controller");

const router = express.Router();

router.route("/classify").post(emnistb_controller.classify);

module.exports = router;
