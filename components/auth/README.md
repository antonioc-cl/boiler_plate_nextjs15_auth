# Authentication Components

This directory contains reusable authentication UI components built with shadcn/ui, React Hook Form, and Zod.

## Components

### LoginForm

A login form component with email and password fields, validation, and error handling.

### SignupForm

A signup form component with email, password, and password confirmation fields, validation, and error handling.

## Usage

The forms are designed to work with server actions. Here's how to integrate them:

1. Create server actions in `app/actions/auth.ts` to handle the actual authentication logic
2. Pass the server action to the form component via the `onSubmit` prop
3. Handle redirects and errors in the page component

## Features

- Full form validation with Zod schemas
- Accessible form inputs with proper labels and ARIA attributes
- Loading states during form submission
- Error message display
- Responsive design with TailwindCSS
- Dark mode support
- Password strength validation for signup
- Proper autocomplete attributes for better UX

## Customization

The components use shadcn/ui components and TailwindCSS for styling. You can customize:

- Colors via CSS variables in `globals.css`
- Form validation rules in the Zod schemas
- Loading and error messages
- Card styling and layout
