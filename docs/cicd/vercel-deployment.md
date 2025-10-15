# Vercel Deployment Configuration

This document explains how to configure and deploy the TryDo application to Vercel.

## Prerequisites

1. Vercel account
2. GitHub repository connected to Vercel
3. Supabase project set up
4. Environment variables configured

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `trydo`

### 2. Configure Build Settings

Vercel will automatically detect Next.js and configure:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### 3. Set Environment Variables

In Vercel dashboard, go to Project Settings > Environment Variables:

#### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Optional Variables
```
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
```

### 4. Configure Domains

1. Go to Project Settings > Domains
2. Add your custom domain (optional)
3. Configure SSL certificates (automatic with Vercel)

### 5. Deploy

#### Automatic Deployment
- Push to `main` branch → Production deployment
- Push to `develop` branch → Preview deployment
- Create Pull Request → Preview deployment

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Environment Configuration

### Production Environment
- **Branch**: `main`
- **Domain**: `your-app.vercel.app`
- **Environment Variables**: Production Supabase credentials

### Staging Environment
- **Branch**: `develop`
- **Domain**: `your-app-git-develop.vercel.app`
- **Environment Variables**: Staging Supabase credentials

### Preview Environments
- **Trigger**: Pull Requests
- **Domain**: `your-app-git-branch-name.vercel.app`
- **Environment Variables**: Preview/staging credentials

## Build Configuration

The `vercel.json` file configures:
- Next.js framework detection
- Environment variable mapping
- Function runtime settings
- Regional deployment preferences

## Monitoring and Analytics

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. View performance metrics in dashboard
3. Monitor Core Web Vitals

### Error Monitoring
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel's built-in error monitoring

## Performance Optimization

### Build Optimization
- Enable Vercel's automatic optimizations
- Use Next.js Image Optimization
- Configure CDN settings

### Caching
- Static assets cached automatically
- API routes cached based on headers
- Configure cache headers in `next.config.js`

## Security Considerations

### Environment Variables
- Never commit sensitive data
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### HTTPS
- Automatically enabled on Vercel
- Custom domains get SSL certificates
- HSTS headers configured automatically

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify Node.js version compatibility
   - Review build logs in Vercel dashboard

2. **Environment Variable Issues**
   - Ensure variables are set for correct environments
   - Check variable names match exactly
   - Verify no trailing spaces

3. **Deployment Issues**
   - Check GitHub integration
   - Verify branch protection rules
   - Review deployment logs

### Debug Commands
```bash
# Check Vercel CLI version
vercel --version

# View deployment logs
vercel logs

# Test build locally
vercel build
```

## CI/CD Integration

The GitHub Actions workflow automatically:
1. Runs tests and linting
2. Builds the application
3. Deploys to Vercel
4. Runs security scans
5. Handles database migrations

## Backup and Recovery

### Database Backups
- Supabase handles automatic backups
- Configure additional backup strategies
- Test restore procedures

### Code Backups
- GitHub provides repository backups
- Vercel maintains deployment history
- Keep local backups of critical configurations
