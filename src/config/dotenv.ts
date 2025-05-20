import * as dotenv from 'dotenv'
dotenv.config()
export const { 
    PORT = '3000', 
    BUDA_URL = 'https://www.buda.com/api/v2',
    LOG_LEVEL = 'info'
} = process.env
