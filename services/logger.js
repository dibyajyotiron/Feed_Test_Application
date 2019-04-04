const winston = require("winston"),
  path = require("path"),
  appDir = path.dirname(require.main.filename),
  { combine, timestamp, colorize, printf, splat } = winston.format;
// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: "info",
    filename: `${appDir}/logs/all.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const myFormat = printf(info => {
  if (info.meta && info.meta instanceof Error) {
    return `${info.timestamp} ${info.level} ${info.message} : ${info.meta}`;
  }
  return `${info.level} ${info.message}`;
});
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console({
      ...options.console,
      format: combine(colorize(), timestamp(), splat(), myFormat)
    })
  ],
  exitOnError: false // do not exit on handled exceptions
});

logger.exceptions.handle(new winston.transports.File({ filename: `${appDir}/logs/exceptions/uncaughtExceptions.log` }));

process.on("unhandledRejection", reason => {
  throw reason;
});

module.exports = logger;
