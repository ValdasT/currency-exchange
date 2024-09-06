import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import createLRUCache from '../../app/utils/lruCache'

// Create a cache instance with a size of 5
const cache = createLRUCache<string, number>(5);

type SuccessResponse = {
  exchangeRate: string
  quoteAmount: number
}

type ErrorResponse = {
  error: string
}

type Data = SuccessResponse | ErrorResponse

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'ILS'] as const
type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number]

const isValidCurrency = (currency: string): currency is SupportedCurrency => {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)
}

// Utility function to handle errors in a consistent way
const handleError = (res: NextApiResponse<ErrorResponse>, message: string, statusCode = 400) => {
  return res.status(statusCode).json({ error: message })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
      const { baseCurrency, quoteCurrency, baseAmount } = req.query

    // Input validation
    if (typeof baseCurrency !== 'string' || !isValidCurrency(baseCurrency)) {
      return handleError(res, 'Invalid or unsupported base currency')
    }
    if (typeof quoteCurrency !== 'string' || !isValidCurrency(quoteCurrency)) {
      return handleError(res, 'Invalid or unsupported quote currency')
    }
    if (typeof baseAmount !== 'string' || isNaN(parseInt(baseAmount, 10))) {
      return handleError(res, 'Invalid base amount')
    }

    const baseAmountInt = parseInt(baseAmount, 10)

    // Cache logic
    const cacheKey = `${baseCurrency}_${quoteCurrency}`
    let exchangeRate = cache.get(cacheKey)
    if (exchangeRate) {
      console.log(`Cache found for ${cacheKey}`)
    } else {
        console.log(`Cache miss for ${cacheKey}`)
        const apiUrl = process.env.EXCHANGE_API_URL
        if (!apiUrl) {
          return res.status(500).json({ error: 'API URL is not defined' })
        }

      // Fetching exchange rates from third-party API
      const response = await axios.get(apiUrl)
      const rates = response.data.rates

      if (!rates[quoteCurrency] || (baseCurrency !== 'USD' && !rates[baseCurrency])) {
        return handleError(res, 'Exchange rate not available', 500)
      }

      // Calculate exchange rate
      if (baseCurrency === 'USD') {
        exchangeRate = rates[quoteCurrency]
      } else {
        const usdToBase = rates[baseCurrency]
        const usdToQuote = rates[quoteCurrency]
        exchangeRate = usdToQuote / usdToBase
      }

      // Cache the result
      cache.set(cacheKey, exchangeRate as number)
    }

    // Calculate the quote amount
    const quoteAmount = Math.round(baseAmountInt * (exchangeRate as number))

    // Respond with the result
    res.status(200).json({
      exchangeRate: (exchangeRate as number).toFixed(3),
      quoteAmount,
    })
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return handleError(res, 'Failed to fetch exchange rates', 500)
  }
}
