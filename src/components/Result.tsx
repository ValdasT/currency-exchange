import React from 'react'
import styles from '../app/page.module.css'

interface ResultProps {
  exchangeRate: string
  quoteAmount: number
}

const Result: React.FC<ResultProps> = ({ exchangeRate, quoteAmount }) => (
  <div className={styles.result}>
    <p>Exchange Rate: {exchangeRate}</p>
    <p>Converted Amount: {quoteAmount} cents</p>
  </div>
)

export default Result
