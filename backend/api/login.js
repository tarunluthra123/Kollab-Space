const route = require('express').Router()
const jwt = require("jsonwebtoken");
const User = require('../db/model').User
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret123'

function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET);
}

route.get('/', (req, res) => {
    console.log(req.query.token)
    const decoded = jwt.verify(req.query.token, TOKEN_SECRET);
    console.log(decoded)
    res.json(decoded)
})

route.post('/', async (req, res) => {
    const query = req.body
    console.log("query = ", query)
    try {
        const result = await User.findOne({
            where: {
                username: query.username,
                password: query.password
            }
        })
        if (result) {
            const name = result.name
            const token = generateAccessToken({...query, name})
            res.send({
                data: {
                    token
                }
            })
        } else {
            res.send({errors: "Invalid username or password"})
        }
    } catch (err) {
        res.send({errors: err})
    }
})

exports = module.exports = route