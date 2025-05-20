// src/server.ts
import { PORT } from '@/config/dotenv'
import app from '@/app'
import logger from '@/config/logger'

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`))
