const https = require("https");
const RECAPTCHA_API_KEY = "6LduixgqAAAAAAFyO_u3lL4dJg_zBhc4kDCbQnQl";

function https_post({ body, ...options }) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: "POST",
            ...options,
        }, res => {
            const chunks = [];
            res.on("data", data => chunks.push(data));
            res.on("end", () => {
                let res_body = Buffer.concat(chunks);
                switch (res.headers["content-type"]) {
                    case "application/json":
                        res_body = JSON.parse(res_body);
                        break;
                }
                resolve(res_body);
            });
        });
        req.on("error", reject);
        if (body) {
            req.write(body);
        }
        req.end();
    });
};

exports.verify = async (req, res) => {
    try {
        console.log("token" + req.body.token);
        const token = req.body.token;
        const url=
            `https://google.com/recaptcha/api/siteverify?secret={RECAPTCHA_API_KEY}&response={token}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        res.status(200).json({
            status: "success",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};
