// src/config/logger.ts
import pino, { LoggerOptions } from 'pino'

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info'
}

const logger = pino(options)
export default logger