/**
 * @module lib/index
 * @description Core functionality for retrieving and validating environment variables from different sources.
 * This module provides the internal implementation for the public API.
 */
import { type z } from "zod";
import { type EnvZSource } from "../types/internal.js";
import { type EnvZ } from "../types/public.js";

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
 * Retrieves, validates, and transforms environment variables based on their schemas and sources.
 *
 * @template T - Type extending EnvZ (a record of environment variable entries)
 * @param {T} envEntries - Configuration object defining environment variables and their validation schemas
 * @param {Record<string, any>} importMetaEnv - expects "import.meta.env" here
 * @returns {Object} An object containing all validated and transformed environment variables
 * @throws {Error} When environment variables fail validation against their schemas
 * @internal
 */
export const mapEnvFromSources = <T extends EnvZ>(
  importMetaEnv: Record<string, any>,
  envEntries: T,  
): { [K in keyof T]: z.infer<T[K][0]> } => {
  //
  const rawValues = {} as {
    [K in keyof T]: ReturnType<typeof _getPropertyFromSource>;
  };
  const result = {} as { [K in keyof T]: z.infer<T[K][0]> };

  // Retrieve raw values from defined sources
  for (const key in envEntries) {
    const [, source = "all"] = envEntries[key];
    rawValues[key] = _getPropertyFromSource(key, source, {
      importMeta: importMetaEnv['z.serverOnly'],
      process: process.env
    });
  }

  // Validate each value against its corresponding schema
  for (const key in envEntries) {
    const [schema] = envEntries[key];
    const { success, data, error } = schema.safeParse(rawValues[key]);
    if (success) {
      result[key] = data;
    } else {
      throw new Error(`Error while checking for "${key}" from env: ${error}`);
    }
  }

  return result;
};
