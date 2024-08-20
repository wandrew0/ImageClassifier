const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const Resolver = require("dns/promises").Resolver;

const quick_draw_router = require("./routes/quick_draw_routes");
const emnistb_router = require("./routes/emnistb_routes");
const recaptcha_router = require("./routes/recaptcha");

const resolver = new Resolver();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    const split = req.ip.split(":");
    const ip = split[split.length - 1];

    resolver
        .reverse(ip)
        .then((host) => {
            logger.http(`${req.originalUrl} - ${ip} - ${host}`);
        })
        .catch((err) => {
            logger.http(`${req.originalUrl} - ${ip}`);
            logger.error(err.code === "ECANCELLED" ? "reverse dns timeout" : err);
        });
    setTimeout(() => resolver.cancel(), 5000);

    next();
});

app.use(`/api/quickdraw`, quick_draw_router);
app.use(`/api/emnistb`, emnistb_router);
app.use(`/api/recaptcha`, recaptcha_router);

module.exports = app;

// resolver
//     .reverse(ip)
//     .then((host) => {
//         console.log(`${ip} - ${host}`);
//     })
//     .catch((err) => {
//         console.log(`${ip}`);
//         console.log(err.code === "ECANCELLED" ? "reverse dns timeout" : err);
//     });
// setTimeout(() => resolver.cancel(), 0);
