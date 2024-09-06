"use client" // Client Component

import React, { useState } from 'react'
import axios from 'axios'
import CurrencySelector from '../components/CurrencySelector'
import AmountInput from '../components/AmountInput'
import Result from '../components/Result'
import Error from '../components/Error'
import Spinner from '../components/Spinner/Spinner'
import styles from './page.module.css'

type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'ILS'

interface ApiResponse {
  exchangeRate: string
  quoteAmount: number
}

export default function Home() {
  const [baseCurrency, setBaseCurrency] = useState<SupportedCurrency>('USD')
  const [quoteCurrency, setQuoteCurrency] = useState<SupportedCurrency>('EUR')
  const [baseAmount, setBaseAmount] = useState<number>(100)
  const [exchangeRate, setExchangeRate] = useState<string | null>(null)
  const [quoteAmount, setQuoteAmount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const currencies: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'ILS']

  const handleConvert = async () => {
    setLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/quote', {
        params: { baseCurrency, quoteCurrency, baseAmount }
      })
      setExchangeRate(response.data.exchangeRate)
      setQuoteAmount(response.data.quoteAmount)
      setError(null)
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again.')
      setExchangeRate(null)
      setQuoteAmount(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 style={{marginBottom: '20px'}}>Currency Exchange</h1>

      <CurrencySelector
        value={baseCurrency}
        onChange={(e) => setBaseCurrency(e.target.value as SupportedCurrency)}
        currencies={currencies}
        label="Base Currency:"
      />

      <CurrencySelector
        value={quoteCurrency}
        onChange={(e) => setQuoteCurrency(e.target.value as SupportedCurrency)}
        currencies={currencies}
        label="Quote Currency:"
      />

      <AmountInput
        value={baseAmount}
        onChange={(e) => setBaseAmount(Number(e.target.value))}
      />

      <button className={styles.button} disabled={loading} onClick={handleConvert}>Convert</button>

      {loading && <Spinner />}

      {exchangeRate && quoteAmount !== null && !loading && (
        <Result
          exchangeRate={exchangeRate}
          quoteAmount={quoteAmount}
        />
      )}

      {error && !loading && <Error message={error} />}
    </div>
  )
}
