# Render Deployment Fix

## Issue: `rimraf: not found` during build

The error occurs because `rimraf` is not available in Render's build environment PATH, even though it's installed as a dependency.

## Solution

The build command has been simplified to just use `tsc` directly:

```json
"build": "tsc"
```

TypeScript will automatically overwrite existing compiled files, so manual cleanup is not necessary.

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

## Alternative Build Commands (if needed)

If you encounter issues, you can try these alternatives:

### Option 1: Use npx rimraf
```json
"build": "npx rimraf build && tsc"
```

### Option 2: Use node_modules directly
```json
"build": "node_modules/.bin/rimraf build && tsc"
```

### Option 3: Manual cleanup with cross-platform script
```json
"build": "node -e \"const fs=require('fs'); try { fs.rmSync('build', {recursive:true,force:true}); } catch(e){}\" && tsc"
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
