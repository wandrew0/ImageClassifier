const app = require("./app");
const logger = require("./logger");

app.listen(process.env.PORT, () => {
    logger.info(`Running on port ${process.env.PORT}`);
});
