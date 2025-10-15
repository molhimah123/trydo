# GitHub Secrets Configuration Guide

This document outlines the required GitHub secrets for the CI/CD pipeline.

## Required Secrets

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_ACCESS_TOKEN`: Supabase CLI access token (for database migrations)
- `SUPABASE_PROJECT_REF`: Your Supabase project reference ID

### Vercel Configuration
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### Security & Monitoring (Optional)
- `SNYK_TOKEN`: Snyk security scanning token
- `CODECOV_TOKEN`: Codecov coverage reporting token

## How to Set Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with the exact name and value

## Environment-Specific Secrets

### Staging Environment
Set up staging-specific secrets in GitHub Environments:
1. Go to Settings > Environments
2. Create "staging" environment
3. Add environment-specific secrets

### Production Environment
Set up production-specific secrets in GitHub Environments:
1. Go to Settings > Environments
2. Create "production" environment
3. Add environment-specific secrets with protection rules

## Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. For access token: Go to Account > Access Tokens

## Getting Vercel Credentials

1. Go to Vercel dashboard
2. Navigate to Settings > Tokens
3. Create a new token
4. Get Org ID and Project ID from project settings

## Security Best Practices

- Never commit secrets to version control
- Use different secrets for different environments
- Rotate secrets regularly
- Use least privilege principle
- Monitor secret usage
