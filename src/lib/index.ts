/**
 * @module lib/index
 * @description Core functionality for retrieving and validating environment variables from different sources.
 * This module provides the internal implementation for the public API.
 */
import { type z } from "zod";
import { type EnvZSource } from "../types/internal.js";
import { type EnvZ } from "../types/public.js";

//
export const dotenvValuesAtKeyName = 'z.serverOnly' as const;

/**
 * Retrieves an environment variable value from the specified source.
 *
 * @param {string} propertyName - The name of the environment variable to retrieve
 * @param {EnvZSource} source - The source from which to retrieve the value
 * @returns {string | undefined} The value of the environment variable, or undefined if not found
 * @private
 */
const _getPropertyFromSource = (
  propertyName: string,
  from: EnvZSource,
  of: Record<Exclude<EnvZSource, "all">, any>
): string | undefined => {
  switch (from) {
    case "process":
    case "importMeta":
      return of[from][propertyName];
    case "all":
      return (
        _getPropertyFromSource(propertyName, "importMeta", of) ??
        _getPropertyFromSource(propertyName, "process", of)
      );
  }
};

/**
 * Retrieves, validates and transforms server-side environment variables based on the provided configuration.
 * 
 * @template T - Type extending EnvZ (a record of environment variable entries with their validation schemas)
 * @param {Record<string, any>} importMetaEnv - expects "import.meta.env" here
 * @param {T} envSchema - Configuration object defining environment variables and their validation schemas
 * @returns {Object} An object containing all validated and transformed environment variables
 * @throws {Error} When environment variables fail validation against their schemas
 * 
 * @example
 * ```ts
 * import { getEnvZ } from 'vike-envz';
 * import { z } from 'zod';
 * 
 * const env = getEnvZ(import.meta.env, {
 *   PORT: [z.string().transform(Number), 'process'],
 *   API_KEY: [z.string().min(1)]
 * });
 * 
 * // env.PORT is now a validated number
 * // env.API_KEY is a validated non-empty string
 * ```
 */
export const parseEnvZ = <T extends EnvZ>(
  importMetaEnv: Record<string, any>,
  envSchema: T,  
): { [K in keyof T]: z.infer<T[K][0]> } => {
  //
  if (!importMetaEnv[dotenvValuesAtKeyName]) {
    throw new Error("You probably forgot to use @qalisa/vike-envz/plugin in your vite.config.js. Please refer to documentation.");
  }

  //
  const rawValues = {} as {
    [K in keyof T]: ReturnType<typeof _getPropertyFromSource>;
  };
  const result = {} as { [K in keyof T]: z.infer<T[K][0]> };

  // Retrieve raw values from defined sources
  for (const key in envSchema) {
    const [, source = "all"] = envSchema[key];
    rawValues[key] = _getPropertyFromSource(key, source, {
      importMeta: importMetaEnv[dotenvValuesAtKeyName],
      process: process.env
    });
  }

  // Validate each value against its corresponding schema
  for (const key in envSchema) {
    const [schema] = envSchema[key];
    const { success, data, error } = schema.safeParse(rawValues[key]);
    if (success) {
      result[key] = data;
    } else {
      throw new Error(`Error while checking for "${key}" from env: ${error}`);
    }
  }

  return result;
};
