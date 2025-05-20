// src/services/budaService.ts
import axios from 'axios'
import { BUDA_URL } from '@/config/dotenv'
import { MarketDTO, TickerDTO } from '@/interfaces/buda.types'

export class BudaService {
  private client = axios.create({ baseURL: BUDA_URL })

  async getTicker(market = 'btc-clp'): Promise<TickerDTO> {
    const { data } = await this.client.get(`/markets/${market}/ticker.json`)
    return data
  }

  async getMarkets(): Promise<MarketDTO[]> {
    const { data } = await this.client.get('/markets.json')
    return data
  }
}

export default new BudaService()