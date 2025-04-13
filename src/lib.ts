import type { z } from "zod";

type EnvZSource = "process" | "importMeta" | "all";

// Définition de l'entrée d'environnement comme un tuple [schema, source?]
// avec "all" comme comportement par défaut
type EnvZEntry<T extends z.ZodType> = [schema: T, source?: EnvZSource];

// Type pour la map des entrées d'environnement
export type EnvZ = Record<string, EnvZEntry<z.ZodType>>;

//
const _getPropertyFromSource = (
  propertyName: string,
  source: EnvZSource,
): string | undefined => {
  switch (source) {
    case "process":
      return process.env[propertyName];
    case "importMeta":
      // @ts-ignore
      return import.meta.env.z.serverOnly[propertyName];
    case "all":
      return (
        _getPropertyFromSource(propertyName, "importMeta") ??
        _getPropertyFromSource(propertyName, "process")
      );
  }
};

//
export const mapEnvFromSources = <T extends EnvZ>(
  envEntries: T,
): { [K in keyof T]: z.infer<T[K][0]> } => {
  //
  const rawValues = {} as {
    [K in keyof T]: ReturnType<typeof _getPropertyFromSource>;
  };
  const result = {} as { [K in keyof T]: z.infer<T[K][0]> };

  // Récupérer les valeurs brutes à partir des sources définies
  for (const key in envEntries) {
    const [, source = "all"] = envEntries[key];
    rawValues[key] = _getPropertyFromSource(key, source);
  }

  // Valider chaque valeur avec son schéma correspondant
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
