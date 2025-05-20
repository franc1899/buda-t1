import { Request, Response } from 'express'
import errorHandler from '../../middlewares/errorHandler'
import logger from '../../config/logger'

jest.mock('../../config/logger')

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  it('should log error and send 500 response', () => {
    const error = new Error('Test error')
    const next = jest.fn()

    errorHandler(error, mockRequest as Request, mockResponse as Response, next)

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

  it('should handle errors without stack trace', () => {
    const error = { message: 'Test error' }
    const next = jest.fn()

    errorHandler(error, mockRequest as Request, mockResponse as Response, next)

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })
}) 