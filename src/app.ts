// src/app.ts
import express from 'express'
import * as dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '@/config/swagger'
import tickerRoutes from '@/routes/tickerRoutes'
import marketRoutes from '@/routes/marketRoutes'
import spreadRoutes from '@/routes/spreadRoutes'
import errorHandler from '@/middlewares/errorHandler'
import asyncHandler from '@/middlewares/asyncHandler'
import pinoHttp from 'express-pino-logger'
import logger from '@/config/logger'

dotenv.config()

const app = express()
app.use(express.json())
app.use(pinoHttp({ logger: logger as any })) // eslint-disable-line @typescript-eslint/no-explicit-any

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', asyncHandler(tickerRoutes))
app.use('/api', asyncHandler(marketRoutes))
app.use('/api', asyncHandler(spreadRoutes))
app.use(errorHandler)
export default app
