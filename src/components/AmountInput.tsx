import React from 'react'
import styles from '../app/page.module.css'

interface AmountInputProps {
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => (
  <div className={styles['input-group']}>
    <label className={styles.label}>Amount to Convert (in cents):</label>
    <input
      className={styles.input}
      type="number"
      value={value}
      onChange={onChange}
    />
  </div>
)

export default AmountInput
