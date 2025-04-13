import {type EnvZ, mapEnvFromSources } from "./lib.js";

/** recover server-side parsed and validated environment variables */
const getEnvZ = (envConfig: EnvZ) => mapEnvFromSources(envConfig);

export { getEnvZ };
