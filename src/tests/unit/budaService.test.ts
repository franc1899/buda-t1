import axios from 'axios';
import { BudaService } from '../../services/budaService';
import { BUDA_URL } from '../../config/dotenv';

jest.mock('axios');
const mockedAxios = axios;

describe('Buda Service', () => {
  let budaService: BudaService;

  beforeEach(() => {
    jest.clearAllMocks();
    budaService = new BudaService();
  });

  describe('getTicker', () => {
    it('should fetch ticker data for a market', async () => {
      const mockTicker = { ticker: { last_price: ['1000'] } };
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockTicker })
      });

      const result = await budaService.getTicker('btc-clp');

      expect(result).toEqual(mockTicker);
      expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: BUDA_URL });
    });

    it('should use default market if none provided', async () => {
      const mockTicker = { ticker: { last_price: ['1000'] } };
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockTicker })
      });

      await budaService.getTicker();

      expect(mockedAxios.create().get).toHaveBeenCalledWith('/markets/btc-clp/ticker');
    });
  });

  describe('getMarkets', () => {
    it('should fetch all markets', async () => {
      const mockMarkets = { markets: [{ id: 'BTC-CLP' }, { id: 'ETH-CLP' }] };
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockMarkets })
      });

      const result = await budaService.getMarkets();

      expect(result).toEqual(mockMarkets);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/markets');
    });
  });

  describe('getOrderBook', () => {
    it('should fetch order book for a market', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      };
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockOrderBook })
      });

      const result = await budaService.getOrderBook('btc-clp');

      expect(result).toEqual(mockOrderBook);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/markets/btc-clp/order_book');
    });

    it('should use default market if none provided', async () => {
      const mockOrderBook = {
        order_book: {
          asks: [['1000', '1']],
          bids: [['900', '1']]
        }
      };
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockOrderBook })
      });

      await budaService.getOrderBook();

      expect(mockedAxios.create().get).toHaveBeenCalledWith('/markets/btc-clp/order_book');
    });
  });
}); 