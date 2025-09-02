import mongoose from 'mongoose'
import "dotenv/config.js";

export const connectDB = async ()=>{
    try {
      const conn =  await mongoose.connect(process.env.MONGO_URI)
        console.log(`db connected${conn.connection.host}`)
        
    } catch (error) {
        console.log('lost')
    }
}