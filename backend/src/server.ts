import { createServer } from "http"
import { env } from "./config/env"
import app from "./app"
import { setupSocket } from "./config/socket"
import logger from "./config/logger"

const PORT = env.PORT
const server = createServer(app)

// Initialize Socket.io
setupSocket(server).catch((err: any) => {
  logger.error("Failed to setup socket:", err);
});

server.listen(PORT, () => {
  logger.info(`Server running on ${PORT}`)
})