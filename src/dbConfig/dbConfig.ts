import mongoose, { connection } from 'mongoose'

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017')

        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Mongodb Connected')
        })
        connection.on('error', (err) => {
            console.log('Mongodb Connection error.')
            process.exit()
        })

    } catch (error) {
        console.log('something went wrong in connecting DB')
        console.log(error)
    }
}