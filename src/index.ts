/**
 * @module vike-envz
 * @description A type-safe environment variable management system for Vike applications.
 * This module validates and transforms environment variables using Zod schemas.
 */
import { mapEnvFromSources } from "./lib/index.js";
import { type EnvZ } from "./types/public.js";

/**
 * Retrieves, validates and transforms server-side environment variables based on the provided configuration.
 * 
 * @template T - Type extending EnvZ (a record of environment variable entries with their validation schemas)
 * @param {T} envConfig - Configuration object defining environment variables and their validation schemas
 * @returns {Object} An object containing all validated and transformed environment variables
 * @throws {Error} When environment variables fail validation against their schemas
 * 
 * @example
 * ```ts
 * import { getEnvZ } from 'vike-envz';
 * import { z } from 'zod';
 * 
 * const env = getEnvZ({
 *   PORT: [z.string().transform(Number), 'process'],
 *   API_KEY: [z.string().min(1)]
 * });
 * 
 * // env.PORT is now a validated number
 * // env.API_KEY is a validated non-empty string
 * ```
 */
const getEnvZ = mapEnvFromSources;

export { getEnvZ };
export * from './types/public.js';