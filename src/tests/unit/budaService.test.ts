import axios, { type AxiosInstance } from 'axios'

jest.mock('axios', () => {
  const mockAxiosInstance: jest.Mocked<AxiosInstance> = {
    get: jest.fn()
  } as unknown as jest.Mocked<AxiosInstance>;

  return {
    __esModule: true,
    default: {
      // axios.create() should always hand back the same mocked instance
      create: jest.fn(() => mockAxiosInstance)
    }
  };
});

import budaService from '@/services/budaService'

const mockedAxios = (axios.create as jest.Mock).mock.results[0].value as jest.Mocked<AxiosInstance>;

describe('BudaService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(axios.create as jest.Mock).mockReturnValue(mockedAxios)
  })

  describe('getTicker', () => {
    const mockTickerResponse = {
      last_price: [50000000, 'CLP'],
      market_id: 'BTC-CLP',
      max_bid: [49900000, 'CLP'],
      min_ask: [50100000, 'CLP'],
      price_variation_24h: 2.5,
      price_variation_7d: 5.0,
      volume: [10.5, 'BTC']
    }

    it('should fetch ticker data for default market', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTickerResponse })

      const result = await budaService.getTicker()

      expect(mockedAxios.get).toHaveBeenCalledWith('/markets/btc-clp/ticker')
      expect(result).toEqual(mockTickerResponse)
    })

    it('should fetch ticker data for specified market', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTickerResponse })

      const result = await budaService.getTicker('eth-clp')

      expect(mockedAxios.get).toHaveBeenCalledWith('/markets/eth-clp/ticker')
      expect(result).toEqual(mockTickerResponse)
    })

    it('should handle errors when fetching ticker', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(error)

      await expect(budaService.getTicker()).rejects.toThrow('Network error')
    })
  })

  describe('getMarkets', () => {
    const mockMarketsResponse = {
      markets: [
        {
          id: 'BTC-CLP',
          name: 'Bitcoin/Chilean Peso',
          base_currency: 'BTC',
          quote_currency: 'CLP',
          minimum_order_amount: [0.001, 'BTC'],
          taker_fee: 0.008,
          maker_fee: 0.008,
          max_orders_per_minute: 60,
          maker_discount_percentage: 0,
          taker_discount_percentage: 0,
          maker_discount_tiers: {},
          taker_discount_tiers: {}
        }
      ]
    }

    it('should fetch all markets', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockMarketsResponse })

      const result = await budaService.getMarkets()

      expect(mockedAxios.get).toHaveBeenCalledWith('/markets')
      expect(result).toEqual(mockMarketsResponse)
    })

    it('should handle errors when fetching markets', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(error)

      await expect(budaService.getMarkets()).rejects.toThrow('Network error')
    })
  })

  describe('getOrderBook', () => {
    const mockOrderBookResponse = {
      order_book: {
        asks: [
          ['50100000', '1.5'],
          ['50200000', '2.0']
        ],
        bids: [
          ['49900000', '1.0'],
          ['49800000', '2.5']
        ],
        market_id: 'BTC-CLP'
      }
    }

    it('should fetch order book for default market', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockOrderBookResponse })

      const result = await budaService.getOrderBook()

      expect(mockedAxios.get).toHaveBeenCalledWith('/markets/btc-clp/order_book')
      expect(result).toEqual(mockOrderBookResponse)
    })

    it('should fetch order book for specified market', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockOrderBookResponse })

      const result = await budaService.getOrderBook('eth-clp')

      expect(mockedAxios.get).toHaveBeenCalledWith('/markets/eth-clp/order_book')
      expect(result).toEqual(mockOrderBookResponse)
    })

    it('should handle errors when fetching order book', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(error)

      await expect(budaService.getOrderBook()).rejects.toThrow('Network error')
    })
  })

  describe('getMarket', () => {
    it('should fetch market data for default market', async () => {
      const mockMarketResponse = {
        market: {
          id: 'BTC-CLP',
          name: 'Bitcoin/Chilean Peso',
          base_currency: 'BTC',
          quote_currency: 'CLP',
          minimum_order_amount: [0.001, 'BTC'],
          taker_fee: 0.008,
          maker_fee: 0.008,
          max_orders_per_minute: 60,
          maker_discount_percentage: 0,
          taker_discount_percentage: 0,
          maker_discount_tiers: {},
          taker_discount_tiers: {}
        }
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockMarketResponse })

      const result = await budaService.getMarket()

      expect(mockedAxios.get).toHaveBeenCalledWith('/markets/btc-clp')
      expect(result).toEqual(mockMarketResponse)
    })

    it('should handle errors when fetching market', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValueOnce(error)

      await expect(budaService.getMarket()).rejects.toThrow('Network error')
    })
  })
})