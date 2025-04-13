import { mapEnvFromSources } from "./lib/index.js";
import {type EnvZ } from "./types/public.js";

/** recover server-side parsed and validated environment variables */
const getEnvZ = <T extends EnvZ>(envConfig: T) => mapEnvFromSources(envConfig);

export { getEnvZ };
export * from './types/public.js';