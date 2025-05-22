import request from 'supertest'
import app from '../../app'

describe('Market API', () => {
  it('should return all markets', async () => {
    const response = await request(app).get('/api/markets')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        markets: expect.any(Array)
    })
  })
})