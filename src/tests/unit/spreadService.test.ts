// tests/unit/spreadService.test.ts
import { getSpreadForMarket, getSpreadForAllMarkets, compareWithLast, setSpreadValue } from '@/services/spreadService'
import budaService from '@/services/budaService'
import { saveSpread, getLastSpread } from '@/repositories/spreadRepository'
import { AxiosError, AxiosResponse } from 'axios'

// Mock the dependencies
jest.mock('@/services/budaService')
jest.mock('@/repositories/spreadRepository')

describe('Spread Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSpreadForMarket', () => {
    it('should calculate spread correctly from order book', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1'], ['1100', '1']],
          bids: [['900', '1'], ['800', '1']]
        }
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)

      const result = await getSpreadForMarket('btc-clp')

      expect(result).toEqual({
        market: 'btc-clp',
        value: 100, // 1000 - 900
        recordedAt: expect.any(Date)
      })
    })

    it('should save spread when persist is true', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)
      ;(saveSpread as jest.Mock).mockResolvedValue(undefined)

      await getSpreadForMarket('btc-clp', true)

      expect(saveSpread).toHaveBeenCalledWith({
        market: 'btc-clp',
        value: 100,
        recordedAt: expect.any(Date)
      })
    })

    it('should throw error when no orders available', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [],
          bids: []
        }
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)

      await expect(getSpreadForMarket('btc-clp')).rejects.toThrow('No orders available in the order book')
    })
  })

  describe('getSpreadForAllMarkets', () => {
    it('should get spreads for all markets', async () => {
      const mockMarkets = {
        markets: [
          { id: 'BTC-CLP' },
          { id: 'ETH-CLP' }
        ]
      }
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      }
      ;(budaService.getMarkets as jest.Mock).mockResolvedValue(mockMarkets)
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)

      const results = await getSpreadForAllMarkets()

      expect(results).toHaveLength(2)
      expect(results[0].market).toBe('btc-clp')
      expect(results[1].market).toBe('eth-clp')
    })
  })

  describe('compareWithLast', () => {
    it('should return no-previous-data when no last spread exists', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)
      ;(getLastSpread as jest.Mock).mockResolvedValue(null)

      const result = await compareWithLast('btc-clp')

      expect(result).toEqual({
        current: {
          market: 'btc-clp',
          value: 100,
          recordedAt: expect.any(Date)
        },
        alert: 'no-previous-data'
      })
    })

    it('should compare current spread with last spread', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      }
      const mockLastSpread = {
        market: 'btc-clp',
        value: 50,
        recordedAt: new Date()
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)
      ;(getLastSpread as jest.Mock).mockResolvedValue(mockLastSpread)

      const result = await compareWithLast('btc-clp')

      expect(result).toEqual({
        current: {
          market: 'btc-clp',
          value: 100,
          recordedAt: expect.any(Date)
        },
        last: mockLastSpread,
        diff: 50,
        percentage: 100,
        alert: 'higher'
      })
    })

    it('should return same alert when spread is unchanged', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      }
      const mockLastSpread = {
        market: 'btc-clp',
        value: 100,
        recordedAt: new Date()
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)
      ;(getLastSpread as jest.Mock).mockResolvedValue(mockLastSpread)

      const result = await compareWithLast('btc-clp')

      expect(result).toEqual({
        current: {
          market: 'btc-clp',
          value: 100,
          recordedAt: expect.any(Date)
        },
        last: mockLastSpread,
        diff: 0,
        percentage: 0,
        alert: 'same'
      })
    })

    it('should return lower alert when spread decreased', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      }
      const mockLastSpread = {
        market: 'btc-clp',
        value: 150,
        recordedAt: new Date()
      }
      ;(budaService.getOrderBook as jest.Mock).mockResolvedValue(mockOrderBook)
      ;(getLastSpread as jest.Mock).mockResolvedValue(mockLastSpread)

      const result = await compareWithLast('btc-clp')

      expect(result.current).toEqual({
        market: 'btc-clp',
        value: 100,
        recordedAt: expect.any(Date)
      })
      expect(result.last).toEqual(mockLastSpread)
      expect(result.diff).toBe(-50)
      expect(result.percentage).toBeCloseTo(-33.33, 2)
      expect(result.alert).toBe('lower')
    })
  })

  describe('setSpreadValue', () => {
    it('should throw BadRequestError when value is missing', async () => {
      await expect(setSpreadValue('btc-clp', 0)).rejects.toThrow('Invalid spread value')
    })

    it('should throw NotFoundError when market does not exist', async () => {
      const mockError = new AxiosError('Market not found')
      mockError.response = { status: 404 } as AxiosResponse
      ;(budaService.getMarket as jest.Mock).mockRejectedValue(mockError)

      await expect(setSpreadValue('non-existent', 100)).rejects.toThrow('Market not found')
    })

    it('should save spread when market exists', async () => {
      const mockMarket = { id: 'btc-clp' }
      ;(budaService.getMarket as jest.Mock).mockResolvedValue(mockMarket)
      ;(saveSpread as jest.Mock).mockResolvedValue(undefined)

      const result = await setSpreadValue('btc-clp', 100)

      expect(result).toEqual({
        market: 'btc-clp',
        value: 100,
        recordedAt: expect.any(Date)
      })
      expect(saveSpread).toHaveBeenCalledWith({
        market: 'btc-clp',
        value: 100,
        recordedAt: expect.any(Date)
      })
    })
  })
})