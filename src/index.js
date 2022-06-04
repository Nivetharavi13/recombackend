import express from 'express'
import { connectDB } from './services/mongodb/connectDB'
const app = express()

const PORT = 8089
const DB_URI = 'HGFHGDFHADGA'


connectDB()


app.listen(PORT,()=> {
    console.log(`server listening to posrt ${PORT}`)
})