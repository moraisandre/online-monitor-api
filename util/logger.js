const { logPath } = require('../config');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
  filename: `${logPath}\\online-monitor-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '4m',
  maxFiles: '1d'
});

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.splat(),
    myFormat
  ),
  defaultMeta: { service: 'online-monitor-api' },
  transports: [
    new transports.Console(),
    // new transports.File({ filename: `${logPath}\\online-monitor.log` }),
    transport
  ]
});


module.exports = logger;