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
 */
const getEnvZ_U = <T extends EnvZ>(): T => {
    if (!singleton) 
        throw new Error("use getEnvZ_S before using getEnvZ")
    return singleton;
}

export { parseEnvZ, getEnvZ_S, getEnvZ_U };
export * from './types/public.js';