const express = require("express");
const cors = require("cors");
const logger = require("./logger");

const quick_draw_router = require("./routes/quick_draw_routes");
const emnistb_router = require("./routes/emnistb_routes");
const recaptcha_router = require("./routes/recaptcha");

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    logger.http(req.ip);
    next();
});

app.use(`/api/quickdraw`, quick_draw_router);
app.use(`/api/emnistb`, emnistb_router);
app.use(`/api/recaptcha`, recaptcha_router);

module.exports = app;
