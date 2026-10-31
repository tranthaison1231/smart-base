import { serve } from "@hono/node-server"
import app from "../src/index"

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`API listening at http://localhost:${info.port}`)
})
