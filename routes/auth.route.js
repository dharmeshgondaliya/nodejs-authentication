import express from "express"
import createError from "http-errors"
const router = express.Router()
import User from '../models/user.model.js'
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../helpers/jwt_helper.js'


router.get('/', verifyAccessToken, async (req, res) => {
    res.send("Hello from express")
})
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        if (!name) throw createError.BadRequest('Name cannot be empty')
        if (!email) throw createError.BadRequest('Email cannot be empty')
        if (!password) throw createError.BadRequest('Password cannot empty')

        const userExist = await User.findOne({ email: email })
        if (userExist) throw createError.Conflict(`${email} is already been registered`)

        const user = User({ name: name, email: email, password: password })
        const savedUser = await user.save()

        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)

        res.json({ accessToken, refreshToken })

    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email) throw createError.BadRequest('Email cannot be empty')
        if (!password) throw createError.BadRequest('Password cannot empty')

        const user = await User.findOne({ email: email })
        if (!user) throw createError.Unauthorized("Invalid username/password")
        const isPasswordMatch = await user.isValidPassword(password)
        if (!isPasswordMatch) throw createError.Unauthorized("Invalid username/password")

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.json({ accessToken, refreshToken })
    } catch (err) {
        next(err)
    }
})

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const access_token = await signAccessToken(userId)
        const refresh_token = await signRefreshToken(userId)

        res.json({ accessToken: access_token, refreshToken: refresh_token })

    } catch (err) {
        next(err)
    }
    res.send("Refresh token route")
})

router.delete('/logout', async (req, res, next) => {
    res.send("Logout route")
})

export default router