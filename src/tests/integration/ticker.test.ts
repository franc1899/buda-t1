import request from 'supertest'
import app from '../../app'

describe('Ticker API', () => {
  it('should return ticker data for a market', async () => {
    const response = await request(app).get('/api/ticker/btc-clp')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      market: 'btc-clp',
      lastPrice: expect.any(Number),
      ask: expect.any(Number),
      bid: expect.any(Number),
      volume: expect.any(Number),
      timestamp: expect.any(String)
    })
  })
})
