# Vercel Project Linking Guide

This document provides step-by-step instructions for linking the Psychiatric Medical Records System repository to Vercel for deployment preparation.

**⚠️ IMPORTANT: This guide covers PROJECT LINKING only. It does NOT deploy the application, run migrations, seed data, or enable production features.**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Project Configuration](#vercel-project-configuration)
3. [Environment Variables](#environment-variables)
4. [Prisma & Serverless Considerations](#prisma--serverless-considerations)
5. [Linking Steps](#linking-steps)
6. [Common Mistakes & Troubleshooting](#common-mistakes--troubleshooting)
7. [Unlinking or Resetting](#unlinking-or-resetting)
8. [What This Does NOT Do](#what-this-does-not-do)

---

## Prerequisites

Before linking to Vercel, ensure:

- ✅ **Repository is pushed to GitHub/GitLab/Bitbucket**
  - The repository must be accessible via a Git provider that Vercel supports
  - All code changes are committed and pushed

- ✅ **Vercel account created**
  - Sign up at [vercel.com](https://vercel.com) if needed
  - Ensure you have access to create new projects

- ✅ **Neon PostgreSQL database exists**
  - Database should be created and accessible
  - Connection string is available (you'll need it for environment variables)
  - **DO NOT** use production database credentials yet if this is a test link

- ✅ **Local build succeeds**
  - Run `npm run build` locally to verify the project builds without errors
  - Fix any build errors before linking

---

## Vercel Project Configuration

### Framework Preset

- **Framework Preset:** `Next.js`
- Vercel will auto-detect Next.js from `package.json`

### Root Directory

- **Root Directory:** `/` (project root)
- No subdirectory configuration needed

### Build Settings

Vercel will auto-detect the following from `package.json`:

- **Build Command:** `next build` (default, no override needed)
- **Output Directory:** `.next` (default, no override needed)
- **Install Command:** `npm install` (default)

### ⚠️ Critical: Prisma Client Generation

**IMPORTANT:** Prisma Client must be generated during the build process. Vercel's default Next.js build does NOT automatically run `prisma generate`.

**Required Build Command Override:**

In the Vercel dashboard, under **Settings → General → Build & Development Settings**, set:

```
Build Command: npm run db:generate && next build
```

**OR** add a `postinstall` script to `package.json` (recommended for consistency):

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

**Note:** If you choose the `postinstall` approach, ensure it's added to `package.json` before linking, as this document focuses on documentation only.

---

## Environment Variables

### Required Variables

The following environment variables **MUST** be configured in the Vercel dashboard before any deployment:

| Variable | Description | Example | Required For |
|----------|-------------|---------|--------------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require` | Database connection |

### Optional Variables

| Variable | Description | When Needed |
|----------|-------------|-------------|
| `NODE_ENV` | Node environment | Auto-set by Vercel to `production` |
| `DEBUG_PRISMA` | Enable Prisma query logging | Debugging only (not recommended in production) |

### ⚠️ Security Requirements

**DO NOT:**
- ❌ Commit `.env` files with secrets
- ❌ Hardcode database credentials in code
- ❌ Share environment variables in documentation or chat
- ❌ Use production database credentials for initial linking/testing

**DO:**
- ✅ Set environment variables only in Vercel dashboard
- ✅ Use separate databases for development, preview, and production
- ✅ Rotate credentials if accidentally exposed
- ✅ Use Vercel's environment variable scoping (Production, Preview, Development)

### Setting Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon PostgreSQL connection string
   - **Environment:** Select appropriate scope:
     - **Production:** For production deployments
     - **Preview:** For pull request previews
     - **Development:** For local development (if using Vercel CLI)
4. Click **Save**

### Environment Variable Scoping

- **Production:** Used for production domain deployments
- **Preview:** Used for branch preview deployments (PRs, branches)
- **Development:** Used when running `vercel dev` locally

**Recommendation:** Set `DATABASE_URL` for all three environments, but use different database instances for each.

---

## Prisma & Serverless Considerations

### ⚠️ CRITICAL: Migrations Must NOT Run Automatically

**DO NOT** configure Vercel to run Prisma migrations during build or deployment.

**Why:**
- Migrations are destructive operations that can modify database schema
- Automatic migrations can cause data loss or schema conflicts
- Migrations should be run manually with proper review and testing
- Multiple deployments could trigger conflicting migration attempts

**What Vercel Should Do:**
- ✅ Generate Prisma Client (`prisma generate`)
- ✅ Build the Next.js application
- ❌ **NOT** run `prisma migrate deploy`
- ❌ **NOT** run `prisma migrate dev`
- ❌ **NOT** run `prisma db push`

### Prisma Client Generation

Prisma Client is generated to a custom location: `src/generated/prisma/`

**During Vercel Build:**
1. `npm install` installs dependencies (including `prisma` CLI)
2. `prisma generate` must run (via `postinstall` or build command)
3. Prisma Client is generated to `src/generated/prisma/`
4. Next.js build uses the generated client

**Verification:**
After linking, check the build logs to confirm:
```
✔ Generated Prisma Client to src/generated/prisma
```

### Serverless Function Considerations

**Connection Pooling:**
- The application uses `pg.Pool` with `@prisma/adapter-pg`
- Each serverless function invocation may create a new connection
- Neon supports connection pooling via connection strings
- Consider using Neon's connection pooler for better performance

**Prisma Client Singleton:**
- The application uses a singleton pattern for Prisma Client
- In serverless environments, each function invocation may create a new instance
- The current implementation handles this via `globalThis` caching
- This is acceptable for Vercel's serverless functions

**Cold Starts:**
- First request to a serverless function may be slower (cold start)
- Prisma Client generation happens at build time, not runtime
- Connection establishment to Neon may add latency on cold starts

---

## Linking Steps

### Step 1: Prepare Repository

1. Ensure all code is committed and pushed:
   ```bash
   git status
   git add .
   git commit -m "Prepare for Vercel linking"
   git push
   ```

2. Verify the repository is accessible on GitHub/GitLab/Bitbucket

### Step 2: Create Vercel Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your Git repository:
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Find and select `clinical-story-manager` repository
   - Click **Import**

### Step 3: Configure Project Settings

1. **Framework Preset:**
   - Should auto-detect as **Next.js**
   - If not, manually select **Next.js**

2. **Root Directory:**
   - Leave as **`/`** (default)

3. **Build Command:**
   - **IMPORTANT:** Override to: `npm run db:generate && next build`
   - Or ensure `postinstall` script exists in `package.json`

4. **Output Directory:**
   - Leave as **`.next`** (default)

5. **Install Command:**
   - Leave as **`npm install`** (default)

### Step 4: Configure Environment Variables

**DO NOT** click "Deploy" yet. First configure environment variables:

1. In the project setup page, expand **Environment Variables**
2. Add `DATABASE_URL`:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon PostgreSQL connection string
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Add**

3. Verify the variable appears in the list

### Step 5: Review and Link

1. Review all settings:
   - ✅ Framework: Next.js
   - ✅ Build Command: `npm run db:generate && next build` (or postinstall)
   - ✅ Environment Variables: `DATABASE_URL` configured
   - ✅ Root Directory: `/`

2. Click **Deploy**

3. **DO NOT** expect the deployment to succeed if:
   - Database migrations haven't been run
   - Database doesn't exist or is inaccessible
   - Build errors occur

4. The first deployment will:
   - Install dependencies
   - Generate Prisma Client
   - Build the Next.js application
   - Deploy to a preview URL

### Step 6: Verify Build Logs

After deployment starts, check the build logs:

1. Click on the deployment in Vercel dashboard
2. Review the build logs for:
   - ✅ `✔ Generated Prisma Client`
   - ✅ `✔ Compiled successfully`
   - ❌ Any errors or warnings

3. If Prisma Client generation is missing, the build will fail with:
   ```
   Error: Cannot find module '@/generated/prisma'
   ```

### Step 7: Post-Linking Verification

1. **Project is linked:**
   - Repository appears in Vercel dashboard
   - Settings are configured correctly

2. **Environment variables are set:**
   - Go to **Settings → Environment Variables**
   - Verify `DATABASE_URL` is present

3. **Build configuration is correct:**
   - Go to **Settings → General**
   - Verify build command includes Prisma generation

---

## Common Mistakes & Troubleshooting

### ❌ Mistake 1: Forgetting Prisma Client Generation

**Symptom:**
```
Error: Cannot find module '@/generated/prisma'
Module not found: Can't resolve '@/generated/prisma'
```

**Solution:**
- Ensure build command includes `npm run db:generate &&` before `next build`
- Or add `"postinstall": "prisma generate"` to `package.json`

### ❌ Mistake 2: Running Migrations Automatically

**Symptom:**
- Build includes `prisma migrate deploy` or `prisma migrate dev`
- Database schema changes unexpectedly
- Migration conflicts or errors

**Solution:**
- Remove any migration commands from build scripts
- Run migrations manually: `npm run db:migrate:deploy` (locally or via CI/CD)
- Never add migrations to `postinstall` or build commands

### ❌ Mistake 3: Missing or Incorrect DATABASE_URL

**Symptom:**
```
Error: P1001: Can't reach database server
Error: Environment variable not found: DATABASE_URL
```

**Solution:**
- Verify `DATABASE_URL` is set in Vercel dashboard
- Check that the connection string is correct (includes `?sslmode=require`)
- Verify the database is accessible from Vercel's IP ranges
- Test the connection string locally first

### ❌ Mistake 4: Using Wrong Database for Environment

**Symptom:**
- Preview deployments modify production database
- Development data appears in production

**Solution:**
- Use separate databases for each environment
- Configure `DATABASE_URL` with appropriate scoping in Vercel
- Production: Production database
- Preview: Staging/test database
- Development: Local or test database

### ❌ Mistake 5: Connection Pooling Issues

**Symptom:**
```
Error: Too many connections
Error: Connection timeout
```

**Solution:**
- Use Neon's connection pooler (add `?pgbouncer=true` to connection string)
- Or use Neon's pooled connection string from dashboard
- Reduce connection pool size in `src/lib/prisma.ts` if needed

### ❌ Mistake 6: Build Fails Due to TypeScript Errors

**Symptom:**
```
Type error: ...
Build failed
```

**Solution:**
- Fix TypeScript errors locally first
- Run `npm run build` locally to catch errors
- Ensure all dependencies are in `package.json` (not just `package-lock.json`)

### ❌ Mistake 7: Missing Dependencies

**Symptom:**
```
Error: Cannot find module '@prisma/adapter-pg'
Error: Module not found
```

**Solution:**
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Runtime dependencies must be in `dependencies`
- Re-run `npm install` and commit `package.json` and `package-lock.json`

---

## Unlinking or Resetting

### Unlinking Project from Vercel

If you need to unlink the project:

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings → General**
4. Scroll to **Danger Zone**
5. Click **Delete Project**
6. Confirm deletion

**Note:** This removes the project from Vercel but does NOT:
- Delete your Git repository
- Delete your database
- Delete local files

### Resetting Project Configuration

To reset configuration without unlinking:

1. Go to **Settings → General**
2. Update incorrect settings:
   - Build Command
   - Root Directory
   - Framework Preset
3. Go to **Settings → Environment Variables**
4. Remove or update incorrect variables
5. Trigger a new deployment

### Starting Fresh

If you need to start completely fresh:

1. Delete the project in Vercel (see above)
2. Create a new project
3. Follow linking steps again
4. Configure settings correctly from the start

---

## What This Does NOT Do

This linking process **explicitly does NOT**:

### ❌ Deployment to Production
- Linking creates a preview deployment
- Production deployment requires additional configuration
- Custom domain setup is separate

### ❌ Database Migrations
- Migrations are NOT run automatically
- Database schema is NOT updated
- You must run migrations manually: `npm run db:migrate:deploy`

### ❌ Database Seeding
- No seed data is created
- Database tables may be empty
- Seed scripts (if any) must be run manually

### ❌ Authentication Setup
- No authentication is configured
- No user management is enabled
- Authentication must be implemented separately

### ❌ Backups or Monitoring
- No automatic backups are configured
- No monitoring or alerting is set up
- These must be configured separately

### ❌ CI/CD Pipeline
- No automatic deployments on push
- No branch protection rules
- No deployment approvals
- These can be configured in Vercel settings after linking

### ❌ Environment-Specific Configuration
- All environments may use the same database (if not scoped)
- Environment-specific features are not configured
- These must be set up separately

---

## Next Steps After Linking

Once the project is successfully linked:

1. **Run Database Migrations:**
   ```bash
   # Locally or via CI/CD
   npm run db:migrate:deploy
   ```

2. **Verify Deployment:**
   - Check preview URL works
   - Test API endpoints
   - Verify database connectivity

3. **Configure Production:**
   - Set up custom domain (if needed)
   - Configure production environment variables
   - Set up branch protection

4. **Set Up Monitoring:**
   - Configure Vercel Analytics (if needed)
   - Set up error tracking
   - Configure uptime monitoring

5. **Security Hardening:**
   - Review environment variable security
   - Set up deployment approvals
   - Configure access controls

---

## Summary Checklist

Before considering the project "linked":

- [ ] Repository is pushed to Git provider
- [ ] Vercel project is created and linked to repository
- [ ] Framework preset is set to Next.js
- [ ] Build command includes Prisma Client generation
- [ ] `DATABASE_URL` environment variable is configured
- [ ] Build succeeds (even if runtime fails due to missing migrations)
- [ ] No migration commands in build scripts
- [ ] Project appears in Vercel dashboard
- [ ] Settings are documented and reviewed

**After linking, you must still:**
- [ ] Run database migrations manually
- [ ] Configure production settings
- [ ] Set up monitoring and backups
- [ ] Test the deployed application

---

*Last updated: Vercel linking preparation*
*Status: Documentation only - no code changes required*
