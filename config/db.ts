import mongoose from 'mongoose'

const connectDB = async () => {
    if (process.env.MONGO_URI) {
        mongoose.set('strictQuery', true)
        const connection = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${connection.connection.host}`)
    }
}

export default connectDB