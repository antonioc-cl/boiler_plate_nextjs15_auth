# CI/CD Setup Guide

This guide will help you set up the CI/CD pipeline for your Next.js 15 project.

## Prerequisites

1. GitHub repository with the code
2. Vercel account (for deployment)
3. Codecov account (optional, for coverage reports)

## Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

### Vercel Deployment Secrets

1. **VERCEL_TOKEN**

   - Get from: https://vercel.com/account/tokens
   - Create a new token with full access

2. **VERCEL_ORG_ID**

   - Get from: Your Vercel project settings → General → Project ID
   - Or run: `vercel link` in your project directory

3. **VERCEL_PROJECT_ID**
   - Get from: Your Vercel project settings → General → Organization ID
   - Or check `.vercel/project.json` after running `vercel link`

### Production Environment Secrets

4. **DATABASE_URL**

   - Your production database connection string
   - Example: `postgresql://user:password@host:5432/dbname`

5. **NEXT_PUBLIC_APP_URL**

   - Your production app URL
   - Example: `https://your-app.vercel.app`

6. **AUTH_SECRET**
   - A secure random string for authentication
   - Generate with: `openssl rand -base64 32`

### Optional Secrets

7. **CODECOV_TOKEN** (optional)

   - Get from: https://codecov.io/gh/[your-username]/[your-repo]/settings
   - Required for private repositories

8. **PREVIEW_DATABASE_URL** (optional)
   - Database URL for preview deployments
   - Can be the same as production or a separate database

## Environment Variables

Create the following repository variables (Settings → Secrets and variables → Actions → Variables):

1. **PREVIEW_APP_URL**
   - URL pattern for preview deployments
   - Example: `https://preview-${{ github.event.pull_request.number }}-your-app.vercel.app`

## Setup Steps

### 1. Initialize Vercel Project

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link your project to Vercel
vercel link

# This will create .vercel/project.json with your project IDs
```

### 2. Configure Vercel Project Settings

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required environment variables for each environment:
   - Production
   - Preview
   - Development

### 3. Enable GitHub Integration (Alternative to CLI)

1. Go to Vercel dashboard → Settings → Git
2. Connect your GitHub repository
3. Configure:
   - Production Branch: `main`
   - Preview Branches: All other branches
   - Automatic Deployments: Can be disabled if using GitHub Actions

### 4. Set Up Codecov (Optional)

1. Go to https://codecov.io
2. Add your repository
3. Copy the upload token
4. Add it as `CODECOV_TOKEN` in GitHub secrets

### 5. Configure Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews
   - Require status checks to pass:
     - `quality`
     - `test`
     - `build`
     - `security`
   - Require branches to be up to date
   - Include administrators

## Workflow Triggers

### CI Workflow (`ci.yml`)

- **Push to main**: Runs all checks
- **Pull requests**: Runs all checks
- **Jobs**:
  - Code quality (formatting, linting, type-check)
  - Tests with coverage
  - Build verification
  - Security scanning

### Deploy Workflow (`deploy.yml`)

- **Push to main**: Deploys to production
- **Pull requests**: Creates preview deployments
- **Manual trigger**: Available via workflow_dispatch

### Performance Workflow (`performance.yml`)

- **Pull requests**: Runs Lighthouse CI and bundle analysis
- **Checks**: Performance, accessibility, best practices, SEO

## Monitoring

### Status Badges

The README includes badges for:

- CI status
- Deployment status
- Code coverage
- Dependency status

Update the badge URLs in README.md with your repository information:

```markdown
[![CI](https://github.com/[username]/[repo]/actions/workflows/ci.yml/badge.svg)](https://github.com/[username]/[repo]/actions/workflows/ci.yml)
```

### Notifications

GitHub Actions will notify you via email for:

- Failed workflows
- Successful deployments
- Security vulnerabilities

## Troubleshooting

### Vercel Deployment Fails

1. Check Vercel logs in GitHub Actions
2. Verify all environment variables are set
3. Ensure `vercel.json` is properly configured
4. Check Vercel dashboard for detailed error logs

### Tests Fail in CI

1. Ensure all test dependencies are installed
2. Check for environment-specific issues
3. Verify database migrations are applied
4. Review test logs in GitHub Actions

### Security Scan Issues

1. Run `pnpm audit --fix` locally
2. Update dependencies with security patches
3. Check for false positives in scan results
4. Use `pnpm update` for minor updates

## Best Practices

1. **Keep secrets secure**: Never commit secrets to the repository
2. **Use environment-specific variables**: Separate production and preview environments
3. **Monitor performance**: Review Lighthouse scores regularly
4. **Update dependencies**: Use Dependabot to keep dependencies current
5. **Review PR checks**: Ensure all checks pass before merging
6. **Cache dependencies**: Workflows use pnpm cache for faster builds
