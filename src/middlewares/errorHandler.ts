// middlewares/errorHandler.ts
import { ErrorRequestHandler } from 'express'
import logger from '@/config/logger'
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
export default errorHandler
