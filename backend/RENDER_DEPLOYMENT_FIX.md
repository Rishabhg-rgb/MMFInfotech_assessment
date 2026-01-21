# Render Deployment Fix

## Issue: `rimraf: not found` during build

The error occurs because `rimraf` is not available in Render's build environment PATH, even though it's installed as a dependency.

## Solution

The build command has been updated to use `rm -rf` instead of `rimraf`:

```json
"build": "rm -rf build && tsc"
```

This uses the standard Unix `rm` command which is available on all Linux systems including Render.

## Render Configuration

### Build Command:

```
npm install && npm run build
```

### Start Command:

```
npm start
```

### Root Directory:

```
backend
```

### Environment Variables:

```
NODE_ENV=production
DATABASE_URL=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d
JWT_ISSUER_NAME=HRMS
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

## Alternative Build Commands

If you still have issues, you can try these alternatives:

### Option 1: Use npx

```json
"build": "npx rimraf build && tsc"
```

### Option 2: Use node_modules directly

```json
"build": "node_modules/.bin/rimraf build && tsc"
```

### Option 3: Skip cleanup (TypeScript will overwrite)

```json
"build": "tsc"
```

## Testing Build Locally

Before deploying, test the build process:

```bash
cd backend
npm install
npm run build
npm start
```

This should compile TypeScript to JavaScript in the `build/` directory and start the server successfully.
