import JWT from 'jsonwebtoken'
import createError from 'http-errors'

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: "1h",
            // issuuer: "example.com",
            audience: userId
        }

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(createError.InternalServerError())
            resolve(token)
        })
    })
}

const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: "1h",
            // issuuer: "example.com",
            audience: userId
        }

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(createError.InternalServerError())
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers.authorization) return next(createError.Unauthorized())
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]
    if (!token) return next(createError.Unauthorized())
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const message = err.message === "jsonWebTokenError" ? 'Unauthorized' : err.message
            return next(createError.Unauthorized(message))
        }
        req.payload = payload
        next()
    })
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createError.Unauthorized())
            resolve(payload.aud)
        })
    })
}

export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken }