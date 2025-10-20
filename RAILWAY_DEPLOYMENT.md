# Railway Deployment Guide

This guide will help you deploy the EMR Backend to Railway.

## Prerequisites

1. A [Railway](https://railway.app) account
2. A PostgreSQL database (can be provisioned on Railway)

## Environment Variables

You need to set the following environment variables in Railway:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | Provided by Railway PostgreSQL service |
| `DB_USERNAME` | PostgreSQL username | Provided by Railway PostgreSQL service |
| `DB_PASSWORD` | PostgreSQL password | Provided by Railway PostgreSQL service |
| `DB_DATABASE` | PostgreSQL database name | Provided by Railway PostgreSQL service |
| `JWT_SECRET` | Secret key for JWT tokens | Generate a secure random string |
| `PORT` | Port to run the server | Automatically set by Railway |
| `NODE_ENV` | Node environment | `production` |

### Setting Up Railway PostgreSQL

If you're using Railway's PostgreSQL service, you can reference the database variables like this:

```
DB_HOST=${{Postgres.PGHOST}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
```

Railway will automatically inject these values from your PostgreSQL service.

## Deployment Steps

### Option 1: Deploy via Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize your project:
   ```bash
   railway init
   ```

4. Add PostgreSQL service (if not already added):
   ```bash
   railway add --plugin postgresql
   ```

5. Set environment variables:
   ```bash
   railway variables set JWT_SECRET=your-secure-random-string
   railway variables set NODE_ENV=production
   ```

6. Deploy:
   ```bash
   railway up
   ```

### Option 2: Deploy via GitHub Integration

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository
5. Railway will automatically detect the NestJS application
6. Add a PostgreSQL database:
   - Click "New" → "Database" → "Add PostgreSQL"
7. Set environment variables:
   - Go to your service settings
   - Navigate to "Variables" tab
   - Add the required environment variables listed above
   - For database variables, reference the PostgreSQL service variables
8. Deploy will trigger automatically

## Running Migrations

After deployment, you need to run database migrations:

1. Via Railway CLI:
   ```bash
   railway run npm run migration:run
   ```

2. Via Railway Dashboard:
   - Go to your service
   - Open "Settings" → "Deploy"
   - Add a one-off command: `npm run migration:run`

## Health Check

The application includes a health check endpoint:

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

You can configure Railway to use this endpoint for health checks.

## API Documentation

Once deployed, your Swagger API documentation will be available at:

```
https://your-app.railway.app/api/docs
```

## CORS Configuration

The application is configured to accept requests from:
- `http://localhost:5173` (local development)
- `https://justmexmehak.github.io` (production frontend)

If you need to add more origins, update the CORS configuration in `src/main.ts`.

## Troubleshooting

### Application won't start

1. Check that all environment variables are set correctly
2. Verify database connection details
3. Check Railway logs for specific error messages

### Database connection errors

1. Ensure PostgreSQL service is running
2. Verify database environment variables
3. Check if migrations have been run

### 502 Bad Gateway

1. Check if application is binding to the correct port (should use Railway's PORT environment variable)
2. Ensure application is listening on `0.0.0.0` not `localhost`

## Important Notes

1. **JWT Secret**: Make sure to use a strong, random JWT secret in production. You can generate one using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Database Migrations**: Always run migrations after deployment and before the application starts serving traffic.

3. **Logs**: Railway provides persistent logs. Console logs from the application will be captured automatically.

4. **File Storage**: Railway uses ephemeral storage, so don't rely on local file storage. Use cloud storage services for persistent files.

## Support

For more information about Railway deployment, visit:
- [Railway Documentation](https://docs.railway.app)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
