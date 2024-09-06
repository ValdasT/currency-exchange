import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AmountInput from '../components/AmountInput'


describe('AmountInput Component', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks() // Clear previous calls to mock functions
  })

  it('should render the input field with correct label and value', () => {
    render(<AmountInput value={100} onChange={mockOnChange} />)

    // Check if the label and input are rendered
    expect(screen.getByText(/Amount to Convert \(in cents\):/i)).toBeInTheDocument()
    const input = screen.getByRole('spinbutton') // 'spinbutton' role is used for number inputs
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(100)
  })

  it('should call onChange handler with the correct event object when the input value changes', () => {
    render(<AmountInput value={100} onChange={mockOnChange} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '200' } })

    // Check if the mock function was called
    expect(mockOnChange).toHaveBeenCalled()

    // Get the actual call arguments
    const callArgs = mockOnChange.mock.calls[0][0]

    // Check the properties of the event object
    expect(callArgs.target.value).toBe('100') 
  })
})

