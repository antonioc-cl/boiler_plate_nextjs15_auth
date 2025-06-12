import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies default variant and size classes', () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole('button', { name: 'Default Button' })
    expect(button).toHaveClass('bg-blue-600', 'px-4', 'py-2')
  })

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button', { name: 'Secondary Button' })
    expect(button).toHaveClass('bg-gray-200', 'text-gray-900')
  })

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Danger Button</Button>)
    const button = screen.getByRole('button', { name: 'Danger Button' })
    expect(button).toHaveClass('bg-red-600', 'text-white')
  })

  it('applies small size classes', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button', { name: 'Small Button' })
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  it('applies large size classes', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button', { name: 'Large Button' })
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button', { name: 'Custom Button' })
    expect(button).toHaveClass('custom-class')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Clickable Button</Button>)
    const button = screen.getByRole('button', { name: 'Clickable Button' })

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
  })

  it('passes through other props', () => {
    render(
      <Button data-testid="test-button" type="submit">
        Submit Button
      </Button>
    )
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
