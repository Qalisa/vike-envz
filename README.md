# vike-envz

A type-safe environment variable management system for Vike applications that enables validation and transformation of environment variables using Zod schemas.

## Features

- 🔒 **Type-safe**: Fully typed environment variables with TypeScript support
- ✅ **Validation**: Schema-based validation using Zod
- 🔄 **Transformation**: Convert environment variables to appropriate types
- 🌐 **Multiple Sources**: Access variables from both process.env and import.meta.env
- 🛠️ **Vite Plugin**: Seamless integration with Vite and Vike

## Installation

```bash
# npm
npm install vike-envz zod

# yarn
yarn add vike-envz zod

# pnpm
pnpm add vike-envz zod
```

## Usage

### Best Practices

Following a modular approach is recommended for better code organization and reusability:

### 1. Define a Shared Environment Schema

Create a dedicated file for your environment schema that can be shared between your Vite config and server code:

```typescript
// server/envz.ts
import type { EnvZ } from "vike-envz";
import { z } from "zod";

export const envSchema = {
  // Build-time variables from import.meta.env
  APP_VERSION: [z.string().nonempty(), "importMeta"],
  
  // Runtime variables from process.env with type coercion
  PORT: [z.coerce.number().positive().default(3000), "process"],
  
  // Variables with default source ("all")
  CANONICAL_URL: [z.string().nonempty()],
  
  // With default values
  DEBUG: [z.enum(['true', 'false']).transform(v => v === 'true').default('false')],
} satisfies EnvZ;
```

### 2. Configure Vite Plugin

Use your shared schema in your Vite configuration:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import envZ from 'vike-envz/plugin';
import { envSchema } from './server/envz';

export default defineConfig({
  plugins: [
    vike(),
    envZ({ envSchema }),
  ]
});
```

### 3. Use in Server with vike-server

```typescript
// server/index.ts
import express from 'express';
import { apply } from 'vike-server/express';
import { serve } from 'vike-server/express/serve';
import { getEnvZ } from "vike-envz";
import { envSchema } from './envz';

function startServer() {
  // Get validated environment variables
  const { PORT, DEBUG, CANONICAL_URL } = getEnvZ(envSchema);
  
  const app = express();
  
  // Apply vike middleware
  apply(app);
  
  // Use validated environment variables
  if (DEBUG) {
    console.log(`Server starting on port ${PORT}`);
    console.log(`Canonical URL: ${CANONICAL_URL}`);
  }
  
  // Start server with validated PORT
  return serve(app, { port: PORT });
}

export default startServer();
```

## Environment Variable Sources

You can specify the source for each environment variable:

- `'process'`: Variables are read from Node.js `process.env`
- `'importMeta'`: Variables are read from Vite's `import.meta.env`
- `'all'`: Variables are read from `import.meta.env` first, then `process.env` as fallback (default)

## Type Safety and Transformations

The library provides full type inference for your environment variables:

```typescript
const env = getEnvZ({
  // String validation
  API_KEY: [z.string().min(1)],
  
  // Number transformation
  PORT: [z.coerce.number().positive()],
  
  // Boolean transformation
  DEBUG: [z.enum(['true', 'false']).transform(v => v === 'true')],
  
  // URL validation
  API_URL: [z.string().url()],
  
  // With default values
  TIMEOUT: [z.coerce.number().default(5000)],
});

// TypeScript will enforce correct types:
env.PORT.toFixed(2); // OK - PORT is a number
env.DEBUG && console.log('Debug mode enabled'); // OK - DEBUG is a boolean
env.TIMEOUT > 1000; // OK - TIMEOUT is a number with default
```

## Error Handling

The library throws descriptive errors when environment variables fail validation:

```typescript
try {
  const env = getEnvZ(envSchema);
} catch (error) {
  console.error('Environment validation failed:', error.message);
  // e.g. "Error while checking for "PORT" from env: Expected string, received undefined"
  process.exit(1);
}
```

## License

MIT
