import { Request, Response, NextFunction } from 'express'
import { getTicker } from '@/controllers/tickerController'
import budaService from '@/services/budaService'

jest.mock('@/services/budaService')

describe('Ticker Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
    nextFunction = jest.fn()
  })

  it('should return ticker data for a market', async () => {
    const mockTicker = { 
      ticker: { 
        market_id: 'BTC-CLP',
        last_price: ['1000'],
        min_ask: ['1000'],
        max_bid: ['1000'],
        volume: ['1000'],
        price_variation_24h: ['1000'],
        price_variation_7d: ['1000']
      } 
    }
    mockRequest.params = { market: 'btc-clp' }
    ;(budaService.getTicker as jest.Mock).mockResolvedValue(mockTicker)

    await getTicker(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(budaService.getTicker).toHaveBeenCalledWith('btc-clp')
    expect(mockResponse.json).toHaveBeenCalledWith(mockTicker)
    expect(nextFunction).not.toHaveBeenCalled()
  })

  it('should handle errors', async () => {
    const error = new Error('API Error')
    mockRequest.params = { market: 'btc-clp' }
    ;(budaService.getTicker as jest.Mock).mockRejectedValue(error)

    await getTicker(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(error)
    expect(mockResponse.json).not.toHaveBeenCalled()
  })
}) 