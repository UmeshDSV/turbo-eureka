const express = require('express')
const campaignRouter = require('./routers/campaign')
const PORT = 3000
const app = express()

app.use(express.json())
app.use(campaignRouter)

app.listen(PORT, () => {
    console.log("Application successfully started on Port :: ", PORT)
})