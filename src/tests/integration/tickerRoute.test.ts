import request from 'supertest'
import app from '../../app'

describe('Ticker API', () => {
  it('should return ticker data for a market', async () => {
    const response = await request(app).get('/api/ticker/btc-clp')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      ticker: {
        market_id: 'BTC-CLP',
        last_price: expect.any(Array),
        min_ask: expect.any(Array),
        max_bid: expect.any(Array),
        volume: expect.any(Array),
        price_variation_24h: expect.any(String),
        price_variation_7d: expect.any(String),
      }
    })
  })
})
