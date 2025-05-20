import { Request, Response, NextFunction } from 'express'
import { getMarkets } from '../../controllers/marketController'
import { getTicker } from '../../controllers/tickerController'
import budaService from '../../services/budaService'

jest.mock('../../services/budaService')

describe('Controllers', () => {
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

  describe('Market Controller', () => {
    it('should return markets data', async () => {
      const mockMarkets = { markets: [{ id: 'BTC-CLP' }, { id: 'ETH-CLP' }] }
      ;(budaService.getMarkets as jest.Mock).mockResolvedValue(mockMarkets)

      await getMarkets(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.json).toHaveBeenCalledWith(mockMarkets)
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('API Error')
      ;(budaService.getMarkets as jest.Mock).mockRejectedValue(error)

      await getMarkets(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(nextFunction).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('Ticker Controller', () => {
    it('should return ticker data for a market', async () => {
      const mockTicker = { ticker: { last_price: ['1000'] } }
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
}) 