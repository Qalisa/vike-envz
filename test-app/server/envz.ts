import type { EnvZ } from "@qalisa/vike-envz"
import { z } from "zod";

export const envSchema = {
    APP_VERSION: [z.string().nonempty(), "importMeta"],
    PORT: [z.coerce.number().positive().default(3000), "process"],
    PORT_B: [z.coerce.number().positive().default(3000)],
    CANONICAL_URL: [z.string().nonempty()/*, "all"*/],
  } satisfies EnvZ;