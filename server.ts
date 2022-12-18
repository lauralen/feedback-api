import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import requests from './routes/requests'
import connectDB from './config/db'
import errorHandler from './middleware/error'

dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

app.use('/requests', requests)
app.use(errorHandler) // must be after app.use('/requests', requests)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
)

process.on('unhandledRejection', (error: Error) => {
	console.log(`Error: ${error.message}`)
	server.close(() => process.exit(1))
})
