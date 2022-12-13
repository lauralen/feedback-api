import express from 'express'
import dotenv from 'dotenv'

import requests from './routes/requests'

dotenv.config({ path: './config/config.env' })

const app = express()

app.use('/requests', requests)

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
