import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;
const fmt = printf(({ level, message, timestamp: ts }) => `${ts} ${level}: ${message}`);

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), fmt),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), fmt),
    }),
  ],
});

export default logger;
