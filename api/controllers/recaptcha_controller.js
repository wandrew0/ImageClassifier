const https = require("https");
const querystring = require("querystring");
const constants = require("./constants");
const logger = require("./../logger");

function https_post({ body, ...options }) {
    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                method: "POST",
                ...options,
            },
            (res) => {
                const chunks = [];
                res.on("data", (data) => chunks.push(data));
                res.on("end", () => {
                    let res_body = Buffer.concat(chunks);
                    switch (res.headers["content-type"]) {
                        case "application/json":
                            res_body = JSON.parse(res_body);
                            break;
                    }
                    resolve(res_body);
                });
            }
        );
        req.on("error", reject);
        if (body) {
            req.write(body);
        }
        req.end();
    });
}

exports.protect = async (req, res, next) => {
    try {
        if (!req.body.key || req.body.key !== constants.API_KEY) {
            throw new Error("API key is not present or wrong");
        } else {
            logger.debug(
                `${req.baseUrl.split("/")[2]} client sent api key: ${req.body.key}`
            );
        }
        next();
    } catch (err) {
        logger.error(err);
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.verify = async (request, response) => {
    try {
        // console.log(req.body.input);
        if (!request.body.token) {
            throw new Error("missing input token");
        }
        var token = request.body.token;
        //logger.debug("token is:" + token);
        // The data to be sent in the POST request as URL-encoded form data
        const postData = querystring.stringify({
            secret: constants.RECAPTCHA_API_KEY,
            response: token,
        });

        // opitons
        const options = {
            hostname: "www.google.com",
            port: 443,
            path: "/recaptcha/api/siteverify",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData),
            },
        };

        // Making the HTTPS request
        const req = https.request(options, (res) => {
            let data = "";

            // Collect the response data
            res.on("data", (chunk) => {
                data += chunk;
            });

            // When the response is complete
            res.on("end", () => {
                let jsonO = JSON.parse(data);
                logger.debug("Response:", jsonO);
                if (jsonO.success) {
                    response.status(200).json({
                        status: "success",
                        api_key: constants.API_KEY,
                    });
                } else {
                    response.status(200).json({
                        status: "fail",
                    });
                }
            });
        });

        // Handling request errors
        req.on("error", (e) => {
            logger.error("Request error:", e.message);
            response.status(200).json({
                status: "fail",
                error: e.message,
            });
        });

        // Writing the data to the request body
        req.write(postData);

        // Ending the request
        req.end();
    } catch (err) {
        logger.error(err);
        response.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};
