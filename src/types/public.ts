import { type z } from "zod";
import { type EnvZEntry } from "./internal.js";

// Type pour la map des entrées d'environnement
export type EnvZ = Record<string, EnvZEntry<z.ZodType>>;