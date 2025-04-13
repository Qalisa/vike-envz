import { loadEnv, type Plugin } from "vite";
import { type EnvZ } from "../lib.js";

const envZ = ({ envSchema }: { envSchema: EnvZ }): Plugin => {
    return {
      name: "vike-envz",
      config: (_, { mode }) => {
        const envAll = loadEnv(mode, process.cwd(), "");
        const envFrom = Object.fromEntries(
          Object.keys(envSchema).map((e) => [e, envAll[e]]),
        );
  
        //
        return {
          define: {
            "import.meta.env.z.serverOnly": {
              ...envFrom,
            },
          },
        };
      },
    };
  };

export default envZ;