// src/services/budaService.ts
import axios from 'axios'
import { TickerDTO, MarketsResponseDTO, OrderBookResponseDTO } from '@/interfaces/buda.types'

const BUDA_URL = process.env.BUDA_URL || 'https://www.buda.com/api/v2'

export class BudaService {
  private client = axios.create({ baseURL: BUDA_URL })

  async getTicker(market = 'btc-clp'): Promise<TickerDTO> {
    const { data } = await this.client.get(`/markets/${market}/ticker`)
    return data
  }

  async getMarkets(): Promise<MarketsResponseDTO> {
    const { data } = await this.client.get('/markets')
    return data
  }

  async getOrderBook(market = 'btc-clp'): Promise<OrderBookResponseDTO> {
    const { data } = await this.client.get(`/markets/${market}/order_book`)
    return data
  }
}

export default new BudaService()