import React from 'react'
import styles from '../app/page.module.css'

interface CurrencySelectorProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  currencies: string[]
  label: string
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, currencies, label }) => (
  <div className={styles['input-group']}>
    <label className={styles.label}>{label}</label>
    <select
      className={styles.select}
      value={value}
      onChange={onChange}
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  </div>
)

export default CurrencySelector
