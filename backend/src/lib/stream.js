import {StreamChat} from 'stream-chat'
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream Api key or secret is missing")

}
const streamClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser = async(userData)=>{
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("eroor in stream user",error)


        
    }
}
// todo later
export const generateStreamToken =(userId)=>{
    try {
        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
        
    } catch (error) {
        console.error("erron generateStreamToken function",error)
    }
}