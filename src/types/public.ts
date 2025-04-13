/**
 * @module types/public
 * @description Public types exposed by the vike-envz library.
 */
import { type z } from "zod";
import { type EnvZEntry } from "./internal.js";

/**
 * @typedef {Object.<string, EnvZEntry<z.ZodType>>} EnvZ
 * @description A record mapping environment variable names to their validation entries.
 * Each entry consists of a Zod schema and an optional source specification.
 * 
 * @example
 * ```ts
 * import { z } from 'zod';
 * 
 * const envConfig: EnvZ = {
 *   PORT: [z.string().transform(Number)],
 *   API_URL: [z.string().url(), 'process'],
 *   DEBUG: [z.enum(['true', 'false']).transform(v => v === 'true'), 'importMeta']
 * };
 * ```
 */
export type EnvZ = Record<string, EnvZEntry<z.ZodType>>;