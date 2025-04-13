/**
 * @module vike-envz
 * @description A type-safe environment variable management system for Vike applications.
 * This module validates and transforms environment variables using Zod schemas.
 */

import { parseEnvZ } from "./lib/index.js";
import type { EnvZ } from "./types/public.js";

//
let singleton = null;

/** 
 * Singleton version of {@link parseEnvZ}. Always ensures initialization, so it is always safe to use.
 */
const getEnvZ_S: typeof parseEnvZ = (...args) => singleton ?? (singleton = parseEnvZ(...args));

/** 
 * Singleton version of {@link parseEnvZ}. Call {@link getEnvZ_S} at least once before using it.
 * 
 * @example
 * ///////////////////////////////////////////////
 * // 1. Define your schema in a dedicated file //
 * ///////////////////////////////////////////////
 * 
 * /// envz.ts
 * import type { EnvZ } from "@qalisa/vike-envz"
 * import { z } from "zod";
 * 
 * export const envSchema = {
 *   APP_VERSION: [z.string().nonempty(), "importMeta"],
 *   PORT: [z.coerce.number().positive().default(3000), "process"],
 *   CANONICAL_URL: [z.string().nonempty()],
 * } satisfies EnvZ;
 * 
 * // Export the type derived from the schema
 * export type envSchema$ = typeof envSchema;
 * 
 * ///////////////////////////////////////////
 * // 2. Use the schema in your application //
 * ///////////////////////////////////////////
 * 
 * /// server/index.ts
 * import { getEnvZ_S, getEnvZ_U } from "@qalisa/vike-envz"
 * import { envSchema, type envSchema$ } from './envz';
 * 
 * // Initialize the environment variables first
 * getEnvZ_S(import.meta.env, envSchema);
 * 
 * // Then you can safely use getEnvZ_U anywhere in your application
 * const env = getEnvZ_U<envSchema$>();
 */
const getEnvZ_U = <T extends EnvZ>(): ReturnType<typeof parseEnvZ<T>> => {
    if (!singleton) 
        throw new Error("use getEnvZ_S before using getEnvZ")
    return singleton;
}

export { parseEnvZ, getEnvZ_S, getEnvZ_U };
export * from './types/public.js';