# Railway Deployment - Quick Reference

## ✅ What Was Fixed

### 1. **Procfile** - Removed Duplicate Build
**Before:**
```
web: npm run build && npm run start:prod
```
**After:**
```
web: node dist/main.js
```
**Why:** The `postinstall` script already runs `npm run build`, so building again in Procfile was redundant and slow.

### 2. **railway.toml** - Added Deploy Configuration
**Before:**
```toml
[build]
builder = "NIXPACKS"
```
**After:**
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "node dist/main.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```
**Why:** Explicit start command and restart policy ensure reliable deployments.

### 3. **data-source.ts** - Fixed Paths for Production
**Before:**
```typescript
entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
```
**After:**
```typescript
entities: [__dirname + '/**/*.entity{.ts,.js}'],
migrations: [__dirname + '/migrations/*{.ts,.js}'],
```
**Why:** In production, code runs from the `dist` folder, not `src`. The old paths would fail.

### 4. **app.module.ts** - Removed File Logging
**Before:** File logging to `logs/` directory
**After:** Console-only logging
**Why:** Railway uses ephemeral filesystem; files don't persist. Console logs are captured automatically.

### 5. **main.ts** - Added Railway-Compatible Binding
**Before:**
```typescript
await app.listen(process.env.PORT ?? 3000);
```
**After:**
```typescript
await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
console.log(`Application is running on: ${await app.getUrl()}`);
```
**Why:** Railway requires binding to `0.0.0.0`, not localhost. The log helps verify startup.

### 6. **JWT Configuration** - Environment Variable Support
**Before:** Hardcoded `'topSecret'`
**After:** `process.env.JWT_SECRET || 'topSecret'`
**Why:** Production apps should use secure, unique JWT secrets via environment variables.

### 7. **Health Check Endpoint**
**Added:** `/health` endpoint
```typescript
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```
**Why:** Railway and monitoring tools can use this to check if the app is running.

## 📋 Required Environment Variables

Set these in Railway dashboard or CLI:

```bash
# Database (from Railway PostgreSQL service)
DB_HOST=${{Postgres.PGHOST}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}

# JWT (generate a secure random string!)
JWT_SECRET=your-secure-random-string-here

# Environment
NODE_ENV=production

# Port (Railway sets this automatically)
PORT=<set by Railway>
```

### Generate Secure JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Quick Deploy Steps

1. **Push code to GitHub** (already done if you're reading this!)

2. **Create Railway project**
   - Go to railway.app/dashboard
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select this repository

3. **Add PostgreSQL database**
   - In your project, click "New"
   - Select "Database" → "Add PostgreSQL"

4. **Set environment variables**
   - Click on your service
   - Go to "Variables" tab
   - Add the environment variables listed above
   - For database vars, reference PostgreSQL service

5. **Deploy**
   - Railway auto-deploys on push
   - First deployment happens automatically after setup

6. **Run migrations** (after first deployment)
   ```bash
   railway run npm run migration:run
   ```

## 🧪 Testing Your Deployment

### Health Check
```bash
curl https://your-app.railway.app/health
```
Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### API Documentation
Visit: `https://your-app.railway.app/api/docs`

## 📚 Documentation

For detailed instructions, see:
- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Complete deployment guide
- [.env.example](./.env.example) - All environment variables

## ⚠️ Important Notes

1. **JWT Secret**: MUST change from default in production!
2. **Migrations**: Must run after deployment and before app handles traffic
3. **CORS**: Currently allows `http://localhost:5173` and `https://justmexmehak.github.io`
4. **Logs**: Only console logs work; use Railway dashboard to view them
5. **File Storage**: Don't store uploaded files locally; use cloud storage (S3, etc.)

## 🔧 Build Process

Railway will:
1. Install dependencies (`npm ci`)
2. Run postinstall script (which runs `npm run build`)
3. Start app with `node dist/main.js`

All of this is automated - you just push code!
