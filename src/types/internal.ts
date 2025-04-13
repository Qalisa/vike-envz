/**
 * @module types/internal
 * @description Internal type definitions used by the vike-envz library.
 * These types support the implementation details and are not typically used directly by consumers.
 */
import type { z } from "zod";

/**
 * @typedef {'process' | 'importMeta' | 'all'} EnvZSource
 * @description Defines the possible sources for environment variables.
 * - 'process': Variables are read from Node.js process.env
 * - 'importMeta': Variables are read from import.meta.env (Vite's environment variables)
 * - 'all': Variables are read from import.meta.env first, then process.env as fallback (default behavior)
 */
export type EnvZSource = "process" | "importMeta" | "all";

/**
 * @typedef {[schema: T, source?: EnvZSource]} EnvZEntry
 * @template T - A Zod schema type used for validation and transformation
 * @description Defines an environment variable entry as a tuple containing:
 * 1. A Zod schema for validation and transformation
 * 2. An optional source specification (defaults to 'all' when omitted)
 */
export type EnvZEntry<T extends z.ZodType> = [schema: T, source?: EnvZSource];

