import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import envZ from '@qalisa/vike-envz/plugin';
import { envSchema } from "./server/envz";

export default defineConfig({
  plugins: [vike({}), react({}), envZ({envSchema})],
  build: {
    target: "es2022",
  },
});
