import express from "express"
import createError from "http-errors"
import router from "./routes/auth.route.js"
import db from './helpers/init_mongodb.js'

const app = express()

app.use(express.json())

app.use('/auth', router)

app.use(async (req, res, next) => {
    // const error = new Error("Not found")
    // error.status = 404
    // next(error)
    next(createError.NotFound("This route does not exist"))
})

app.use((error, req, res, net) => {
    res.status(error.status || 500)
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        }
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})
