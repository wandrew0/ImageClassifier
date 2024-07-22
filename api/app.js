const express = require("express");
const cors = require("cors");

const quick_draw_router = require("./routes/quick_draw_routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use(`/api/quickdraw`, quick_draw_router);

module.exports = app;
