import { Request, Response, NextFunction } from 'express'
import * as spreadController from '@/controllers/spreadController'
import * as spreadService from '@/services/spreadService'

jest.mock('@/services/spreadService')

describe('SpreadController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
    }
    mockNext = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('one', () => {
    it('should get spread for a specific market', async () => {
      const mockSpread = {
        market: 'BTC-CLP',
        value: 1000,
        recordedAt: new Date()
      }

      mockRequest.params = { market: 'BTC-CLP' }
      mockRequest.query = { save: 'false' }

      ;(spreadService.getSpreadForMarket as jest.Mock).mockResolvedValue(mockSpread)

      await spreadController.one(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(spreadService.getSpreadForMarket).toHaveBeenCalledWith('BTC-CLP', false)
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpread)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Test error')
      mockRequest.params = { market: 'BTC-CLP' }
      mockRequest.query = { save: 'false' }

      ;(spreadService.getSpreadForMarket as jest.Mock).mockRejectedValue(error)

      await spreadController.one(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('all', () => {
    it('should get spread for all markets', async () => {
      const mockSpreads = [
        { market: 'BTC-CLP', value: 1000, recordedAt: new Date() },
        { market: 'ETH-CLP', value: 500, recordedAt: new Date() }
      ]

      mockRequest.query = { save: 'false' }

      ;(spreadService.getSpreadForAllMarkets as jest.Mock).mockResolvedValue(mockSpreads)

      await spreadController.all(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(spreadService.getSpreadForAllMarkets).toHaveBeenCalledWith(false)
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpreads)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Test error')
      mockRequest.query = { save: 'false' }

      ;(spreadService.getSpreadForAllMarkets as jest.Mock).mockRejectedValue(error)

      await spreadController.all(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('last', () => {
    it('should compare with last spread', async () => {
      const mockComparison = {
        current: { market: 'BTC-CLP', value: 1000, recordedAt: new Date() },
        last: { market: 'BTC-CLP', value: 900, recordedAt: new Date() },
        diff: 100,
        percentage: 11.11,
        alert: 'higher'
      }

      mockRequest.params = { market: 'BTC-CLP' }

      ;(spreadService.compareWithLast as jest.Mock).mockResolvedValue(mockComparison)

      await spreadController.last(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(spreadService.compareWithLast).toHaveBeenCalledWith('BTC-CLP')
      expect(mockResponse.json).toHaveBeenCalledWith(mockComparison)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Test error')
      mockRequest.params = { market: 'BTC-CLP' }

      ;(spreadService.compareWithLast as jest.Mock).mockRejectedValue(error)

      await spreadController.last(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })
})
