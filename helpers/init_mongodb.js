import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.CONNECTION_URL)

mongoose.connection.on('connected', () => console.log('Mongoose connected to db'))
mongoose.connection.on('error', err => console.log(`Mongoose connection fail: ${err.message}`))
mongoose.connection.on('disconnected', () => console.log('Mongoose connection is connected'))

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})

export default mongoose