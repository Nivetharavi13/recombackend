import express from 'express'

const app = express()

const PORT = 8080
const DB_URI = 'HGFHGDFHADGA'



console.log(PORT)

console.log(DB_URI)

app.listen(PORT,()=> {
    console.log(`server listening to posrt ${PORT}`)
})