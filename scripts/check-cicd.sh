#!/bin/bash

# CI/CD Pipeline Status Check Script
# This script verifies that all CI/CD components are properly configured

echo "🔍 CI/CD Pipeline Status Check"
echo "================================"

# Check if all workflow files exist
echo "📋 Checking workflow files..."
workflows=(
  ".github/workflows/ci-cd.yml"
  ".github/workflows/database-migration.yml"
  ".github/workflows/release.yml"
)

for workflow in "${workflows[@]}"; do
  if [ -f "$workflow" ]; then
    echo "✅ $workflow exists"
  else
    echo "❌ $workflow missing"
    exit 1
  fi
done

# Check if configuration files exist
echo ""
echo "⚙️ Checking configuration files..."
configs=(
  "vercel.json"
  "package.json"
  "eslint.config.js"
  "jest.config.js"
  "next.config.js"
)

for config in "${configs[@]}"; do
  if [ -f "$config" ]; then
    echo "✅ $config exists"
  else
    echo "❌ $config missing"
    exit 1
  fi
done

# Check if documentation exists
echo ""
echo "📚 Checking documentation..."
docs=(
  "docs/cicd/README.md"
  "docs/cicd/github-secrets.md"
  "docs/cicd/vercel-deployment.md"
  "docs/cicd/database-migrations.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo "✅ $doc exists"
  else
    echo "❌ $doc missing"
    exit 1
  fi
done

# Check if required scripts exist in package.json
echo ""
echo "🔧 Checking package.json scripts..."
required_scripts=(
  "dev"
  "build"
  "start"
  "lint"
  "test"
  "test:coverage"
  "db:migrate"
  "db:status"
  "db:diff"
)

for script in "${required_scripts[@]}"; do
  if npm run "$script" --dry-run > /dev/null 2>&1; then
    echo "✅ npm run $script available"
  else
    echo "❌ npm run $script missing"
    exit 1
  fi
done

# Run basic checks
echo ""
echo "🧪 Running basic checks..."

# Check linting
echo "Running ESLint..."
if npm run lint > /dev/null 2>&1; then
  echo "✅ ESLint passes"
else
  echo "❌ ESLint failed"
  exit 1
fi

# Check tests
echo "Running tests..."
if npm test -- --watchAll=false > /dev/null 2>&1; then
  echo "✅ Tests pass"
else
  echo "❌ Tests failed"
  exit 1
fi

# Check build
echo "Running build..."
if npm run build > /dev/null 2>&1; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  exit 1
fi

echo ""
echo "🎉 All CI/CD pipeline checks passed!"
echo "The pipeline is ready for deployment."
echo ""
echo "Next steps:"
echo "1. Set up GitHub secrets (see docs/cicd/github-secrets.md)"
echo "2. Configure Vercel deployment (see docs/cicd/vercel-deployment.md)"
echo "3. Set up Supabase project (see docs/cicd/database-migrations.md)"
echo "4. Push to GitHub to trigger the pipeline"
