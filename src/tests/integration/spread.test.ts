import request from 'supertest'
import app from '../../app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Spread API', () => {
  beforeEach(async () => {
    // Clean up the database before each test
    await prisma.spreadRecord.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('GET /spread/:market', () => {
    it('should return spread for a specific market', async () => {
      const response = await request(app)
        .get('/api/spread/btc-clp')
        .expect(200)

      expect(response.body).toEqual({
        market: 'btc-clp',
        value: expect.any(Number),
        recordedAt: expect.any(String)
      })
    })

    it('should save spread when save=true', async () => {
      await request(app)
        .get('/api/spread/btc-clp?save=true')
        .expect(200)

      const savedSpread = await prisma.spreadRecord.findFirst({
        where: { market: 'btc-clp' }
      })

      expect(savedSpread).toBeTruthy()
      expect(savedSpread?.market).toBe('btc-clp')
      expect(savedSpread?.value).toBeDefined()
    })
  })

  describe('GET /spreads', () => {
    it('should return spreads for all markets', async () => {
      const response = await request(app)
        .get('/api/spreads')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toEqual({
        market: expect.any(String),
        value: expect.any(Number),
        recordedAt: expect.any(String)
      })
    })
  })

  describe('GET /spread/:market/last', () => {
    it('should return no-previous-data when no last spread exists', async () => {
      const response = await request(app)
        .get('/api/spread/btc-clp/last')
        .expect(200)

      expect(response.body).toEqual({
        current: {
          market: 'btc-clp',
          value: expect.any(Number),
          recordedAt: expect.any(String)
        },
        alert: 'no-previous-data'
      })
    })

    it('should compare with last spread when it exists', async () => {
      // First save a spread
      await request(app)
        .get('/api/spread/btc-clp?save=true')
        .expect(200)

      // Then compare with last
      const response = await request(app)
        .get('/api/spread/btc-clp/last')
        .expect(200)

      expect(response.body).toEqual({
        current: {
          market: 'btc-clp',
          value: expect.any(Number),
          recordedAt: expect.any(String)
        },
        last: {
          id: expect.any(Number),
          market: 'btc-clp',
          value: expect.any(String),
          recordedAt: expect.any(String)
        },
        diff: expect.any(Number),
        percentage: expect.any(Number),
        alert: expect.stringMatching(/^(same|higher|lower)$/)
      })
    })
  })
}) 