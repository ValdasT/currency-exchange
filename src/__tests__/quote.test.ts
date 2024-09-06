import { NextApiRequest, NextApiResponse } from 'next'
import handler from '../pages/api/quote'
import axios from 'axios'

// Mocking axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Define a mock cache for testing
const mockCache = new Map<string, number>()

// Mock createLRUCache to use the mockCache
jest.mock('../app/utils/lruCache', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    get: (key: string) => mockCache.get(key) || null,
    set: (key: string, value: number) => mockCache.set(key, value),
  })),
}))

describe('API Handler', () => {
  let req: Partial<NextApiRequest>
  let res: Partial<NextApiResponse>

  beforeEach(() => {
    req = {
      query: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
    mockCache.clear()
    delete process.env.EXCHANGE_API_URL
  })

  it('should return error for invalid base currency', async () => {
    req.query = {
      baseCurrency: 'INVALID',
      quoteCurrency: 'EUR',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or unsupported base currency' })
  })

  it('should return error for invalid quote currency', async () => {
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'INVALID',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or unsupported quote currency' })
  })

  it('should return error for invalid base amount', async () => {
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: 'INVALID',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid base amount' })
  })

  it('should handle cache hit correctly', async () => {
    mockCache.set('USD_EUR', 0.85)
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      exchangeRate: '0.850',
      quoteAmount: 85,
    })
  })

  it('should handle cache miss and fetch from API', async () => {
    process.env.EXCHANGE_API_URL = 'http://mockedapi.com'
    mockedAxios.get.mockResolvedValue({
      data: {
        rates: {
          USD: 1,
          EUR: 0.85,
        },
      },
    })
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(mockedAxios.get).toHaveBeenCalledWith('http://mockedapi.com')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      exchangeRate: '0.850',
      quoteAmount: 85,
    })
  })

  it('should handle API URL not defined', async () => {
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'API URL is not defined' })
  })

  it('should handle API error', async () => {
    process.env.EXCHANGE_API_URL = 'http://mockedapi.com'
    mockedAxios.get.mockRejectedValue(new Error('API Error'))
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch exchange rates' })
  })

  it('should handle exchange rate not available', async () => {
    process.env.EXCHANGE_API_URL = 'http://mockedapi.com'
    mockedAxios.get.mockResolvedValue({
      data: {
        rates: {
          USD: 1,
        },
      },
    })
    req.query = {
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: '100',
    }

    await handler(req as NextApiRequest, res as NextApiResponse)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Exchange rate not available' })
  })
})
