import express from 'express'
import { apply } from 'vike-server/express'
import { serve } from 'vike-server/express/serve'
import { getEnvZ } from "@qalisa/vike-envz"
import { envSchema } from './envz';
 
function startServer() {
  const env = getEnvZ(envSchema);
  const app = express()
  apply(app)
  return serve(app, { port: env.PORT_B })
}
 
export default startServer()