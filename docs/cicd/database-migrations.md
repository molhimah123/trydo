# Database Migration Management

This document outlines the database migration strategy and automation for the TryDo application.

## Migration Strategy

### File Organization
```
supabase/migrations/
├── 001_initial_schema.sql    # Initial database setup
├── 002_add_user_preferences.sql
├── 003_add_task_attachments.sql
└── README.md
```

### Naming Convention
- Use sequential numbering: `001_`, `002_`, etc.
- Use descriptive names: `add_user_preferences`, `create_indexes`
- Include version in filename: `001_initial_schema_v1.sql`

## Migration Types

### Schema Changes
- Table creation/modification
- Column additions/modifications
- Index creation
- Constraint modifications

### Data Migrations
- Data transformations
- Data cleanup
- Reference data updates

### Security Changes
- RLS policy updates
- Permission modifications
- User role changes

## Environment-Specific Migrations

### Development
- Run migrations immediately
- Allow destructive changes
- Use test data

### Staging
- Run migrations on deploy
- Validate all changes
- Use production-like data

### Production
- Manual approval required
- Backup before migration
- Rollback plan required

## Migration Scripts

### Local Development
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Run migrations
supabase db reset

# Check status
supabase db diff
```

### CI/CD Integration
```bash
# Validate migrations
supabase db diff --schema public

# Run migrations (staging)
supabase db push

# Verify schema
supabase db diff --schema public
```

## Safety Procedures

### Pre-Migration Checklist
- [ ] Migration tested locally
- [ ] Migration tested on staging
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Monitoring configured

### Production Migration Process
1. **Schedule maintenance window**
2. **Create database backup**
3. **Run migration in transaction**
4. **Verify migration success**
5. **Update application version**
6. **Monitor for issues**
7. **Document results**

### Rollback Procedures
1. **Identify rollback migration**
2. **Create rollback script**
3. **Test rollback on staging**
4. **Execute rollback in production**
5. **Verify data integrity**
6. **Update application if needed**

## Migration Best Practices

### Schema Changes
```sql
-- Good: Add column with default
ALTER TABLE tasks ADD COLUMN priority task_priority DEFAULT 'medium';

-- Good: Use transactions
BEGIN;
ALTER TABLE tasks ADD COLUMN due_date DATE;
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
COMMIT;

-- Bad: Drop column without deprecation
ALTER TABLE tasks DROP COLUMN old_field;
```

### Data Migrations
```sql
-- Good: Update in batches
UPDATE tasks 
SET status = 'completed' 
WHERE id IN (
  SELECT id FROM tasks 
  WHERE status = 'done' 
  LIMIT 1000
);

-- Good: Use conditional updates
UPDATE tasks 
SET priority = 'high' 
WHERE created_at < '2024-01-01' 
AND priority IS NULL;
```

### RLS Policy Updates
```sql
-- Good: Add policy with proper conditions
CREATE POLICY "tasks_user_access" ON tasks
FOR ALL USING (auth.uid() = user_id);

-- Good: Update existing policy
DROP POLICY IF EXISTS "tasks_old_policy" ON tasks;
CREATE POLICY "tasks_new_policy" ON tasks
FOR ALL USING (auth.uid() = user_id AND status != 'deleted');
```

## Monitoring and Alerting

### Migration Monitoring
- Track migration execution time
- Monitor database performance
- Alert on migration failures
- Log all migration activities

### Performance Considerations
- Use indexes for large tables
- Batch large data operations
- Monitor query performance
- Consider maintenance windows

## Troubleshooting

### Common Issues

1. **Migration Timeout**
   - Break large migrations into smaller chunks
   - Use batch processing
   - Increase timeout limits

2. **Lock Conflicts**
   - Use appropriate lock levels
   - Schedule during low traffic
   - Consider online migrations

3. **Data Integrity Issues**
   - Validate data before migration
   - Use constraints and checks
   - Test rollback procedures

### Debug Commands
```bash
# Check migration status
supabase migration list

# View migration logs
supabase logs db

# Validate schema
supabase db diff --schema public

# Check for issues
supabase db lint
```

## Integration with CI/CD

### GitHub Actions Integration
- Validate migrations on PR
- Run migrations on staging deploy
- Require approval for production
- Notify on migration completion

### Automated Testing
- Test migrations on clean database
- Validate schema changes
- Check data integrity
- Verify performance impact

## Documentation Requirements

### Migration Documentation
Each migration should include:
- Purpose and rationale
- Impact assessment
- Rollback instructions
- Testing procedures
- Performance considerations

### Schema Documentation
- Entity relationship diagrams
- Table descriptions
- Index explanations
- Constraint documentation
