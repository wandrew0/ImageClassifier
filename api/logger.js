const { createLogger, format, transports } = require('winston');
const path = require('path');
const { combine, timestamp, printf, colorize } = format;

// Define custom format for log messages
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logFileName = path.join(process.env.WORK_DIR || "./", "imageclassifier.log");
// Create and configure the logger
const logger = createLogger({
    level: 'debug', // Set the log level, info, debug
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
        customFormat // Use the custom format
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: logFileName }) // Log to a file
    ]
});

// Export the logger
module.exports = logger;
