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

### Define Environment Schema

Create a schema for your environment variables using Zod:

```typescript
// envz.ts
import { getEnvZ } from 'vike-envz';
import { z } from 'zod';

export const env = getEnvZ({
  // Basic string validation
  API_KEY: [z.string().min(1)],
  
  // Number transformation (from string)
  PORT: [z.string().transform(Number), 'process'],
  
  // Boolean transformation with specific source
  DEBUG: [z.enum(['true', 'false']).transform(v => v === 'true'), 'importMeta'],
  
  // URL validation
  API_URL: [z.string().url()],
});
```

### Configure Vite Plugin

Add the vike-envz plugin to your Vite configuration:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import envZ from 'vike-envz/plugin';
import { z } from 'zod';

export default defineConfig({
  plugins: [
    // Your other plugins...
    
    // Add the envZ plugin with your schema
    envZ({
      envSchema: {
        API_KEY: [z.string().min(1)],
        PORT: [z.string().transform(Number)],
        DEBUG: [z.enum(['true', 'false']).transform(v => v === 'true')],
        API_URL: [z.string().url()]
      }
    })
  ]
});
```

### Use Environment Variables

Use your validated environment variables in your code:

```typescript
// server/api.ts
import { env } from './envz';

// Type-safe access to environment variables
const server = createServer({
  port: env.PORT, // number
  debug: env.DEBUG, // boolean
});

// Make API calls with validated URL
const api = new ApiClient({
  url: env.API_URL, // validated URL string
  key: env.API_KEY  // non-empty string
});
```

## Environment Variable Sources

You can specify the source for each environment variable:

- `'process'`: Variables are read from Node.js `process.env`
- `'importMeta'`: Variables are read from Vite's `import.meta.env`
- `'all'`: Variables are read from `import.meta.env` first, then `process.env` as fallback (default)

## Error Handling

The library throws descriptive errors when environment variables fail validation:

```typescript
try {
  const env = getEnvZ({
    PORT: [z.string().transform(Number)]
  });
} catch (error) {
  console.error('Environment validation failed:', error.message);
  // e.g. "Error while checking for "PORT" from env: Expected string, received undefined"
}
```

## TypeScript Support

The library is fully typed, providing autocompletion and type checking for your environment variables:

```typescript
// TypeScript will enforce correct types:
env.PORT.toFixed(2); // OK - PORT is a number
env.DEBUG.toLowerCase(); // Error - DEBUG is a boolean
```

## License

MIT
