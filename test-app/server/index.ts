import express from 'express'
import { apply } from 'vike-server/express'
import { serve } from 'vike-server/express/serve'
import { getEnvZ_S, getEnvZ_U } from "@qalisa/vike-envz"
import { envSchema, type envSchema$ } from './envz';
 
function startServer() {
  //
  getEnvZ_S(import.meta.env, envSchema);
  const env = getEnvZ_U<envSchema$>();

  //
  const app = express()

  //
  apply(app)
  return serve(app, { port: env.PORT_B })
}
 
export default startServer()