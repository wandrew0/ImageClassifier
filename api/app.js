const express = require("express");
const cors = require("cors");

const quick_draw_router = require("./routes/quick_draw_routes");
const emnistb_router = require("./routes/emnistb_routes");
const recaptcha_router = require("./routes/recapcha");

const app = express();

app.use(express.json());
app.use(cors());

app.use(`/api/quickdraw`, quick_draw_router);
app.use(`/api/emnistb`, emnistb_router);
app.use(`/api/recaptcha`, recaptcha_router);

module.exports = app;
