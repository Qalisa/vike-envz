/**
 * @module plugin/index
 * @description Vite plugin for vike-envz that injects environment variables into the Vite build process.
 * This plugin makes environment variables available on the client-side through import.meta.env.
 */
import { loadEnv, type Plugin } from "vite";
import { type EnvZ } from "../types/public.js";

/**
 * Creates a Vite plugin that injects environment variables into the build process.
 * 
 * @param {Object} options - Plugin configuration options
 * @param {EnvZ} options.envSchema - Schema definition for environment variables
 * @returns {Plugin} A Vite plugin instance
 * 
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import envZ from 'vike-envz/plugin';
 * import { z } from 'zod';
 * 
 * export default defineConfig({
 *   plugins: [
 *     envZ({
 *       envSchema: {
 *         API_URL: [z.string().url()],
 *         DEBUG: [z.enum(['true', 'false']).transform(v => v === 'true')]
 *       }
 *     })
 *   ]
 * });
 * ```
 */
const envZ = ({ envSchema }: { envSchema: EnvZ }): Plugin => {
  return {
    name: "vike-envz",
    config: (_, { mode }) => {
      const envAll = loadEnv(mode, process.cwd(), "");
      const envFrom = Object.fromEntries(
        Object.keys(envSchema).map((e) => [e, envAll[e]]),
      );

      // Define environment variables to be injected into import.meta.env
      return {
        define: {
          "import.meta.env.z.serverOnly": {
            ...envFrom,
          },
        },
      };
    },
  };
};

export default envZ;