import type { z } from "zod";

export type EnvZSource = "process" | "importMeta" | "all";

// Définition de l'entrée d'environnement comme un tuple [schema, source?]
// avec "all" comme comportement par défaut
export type EnvZEntry<T extends z.ZodType> = [schema: T, source?: EnvZSource];

