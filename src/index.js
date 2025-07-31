import dotenv from 'dotenv'
import 'dotenv/config';
import dbConnect from './lib/dbConnect.js'

dotenv.config({
    path: './.env'
})

await dbConnect()