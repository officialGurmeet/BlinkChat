import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { errorMiddleware } from './middleware/error.middleware'
import { requestLogger } from './middleware/requestLogger'

import roomRoutes from './modules/room/room.routes'
import publicRoomRoutes from './modules/publicRoom/publicRoom.routes'

const app = express()

app.use(cors())
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
)
app.use(compression())

app.use(express.json())

app.use(requestLogger)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/rooms', roomRoutes)
app.use('/api/public-rooms', publicRoomRoutes)

app.use(errorMiddleware)

export default app
