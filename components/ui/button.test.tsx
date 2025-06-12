import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/src/test/test-utils'
import { Button } from './button'
import React from 'react'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    expect(button).toHaveClass('h-10', 'px-4', 'py-2')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'border-input')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'text-primary',
      'underline-offset-4'
    )
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'px-3')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11', 'px-8')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    )

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should merge custom className', () => {
    render(<Button className="custom-class bg-custom">Custom</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class', 'bg-custom')
  })

  it('should forward ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref Button</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Ref Button')
  })

  it('should support different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')

    rerender(<Button type="button">Button</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')

    rerender(<Button type="reset">Reset</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
  })

  it('should pass through other HTML button attributes', () => {
    render(
      <Button
        aria-label="Custom label"
        data-testid="custom-button"
        form="my-form"
        name="submit-button"
      >
        Button with attrs
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('data-testid', 'custom-button')
    expect(button).toHaveAttribute('form', 'my-form')
    expect(button).toHaveAttribute('name', 'submit-button')
  })

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('should have correct focus styles', () => {
    render(<Button>Focus me</Button>)
    const button = screen.getByRole('button')

    expect(button).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    )
  })

  it('should have correct transition styles', () => {
    render(<Button>Transition</Button>)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('transition-colors')
  })

  it('should handle variant and size combination correctly', () => {
    render(
      <Button variant="outline" size="lg">
        Large Outline
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'border-input') // variant classes
    expect(button).toHaveClass('h-11', 'px-8') // size classes
  })
})
