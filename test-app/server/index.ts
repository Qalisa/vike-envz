import express from 'express'
import { apply } from 'vike-server/express'
import { serve } from 'vike-server/express/serve'
 
function startServer() {
  const app = express()
  apply(app)
  return serve(app, { port: 3000 })
}
 
export default startServer()