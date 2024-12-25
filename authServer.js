require('dotenv').config()

const express = require("express");
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json())

const port = process.env.AUTH_PORT

function generateJWTToken(user) {
    // Create and sign the JWT token with the user information and expiration time
    return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '30s' })
}

app.post('/getInformation', (req, res) => {
    const userName = req.body.userName
    const user = { name: userName }
    
    // Generate access token and refresh token for the user
    const accessToken = generateJWTToken(user)
    const refershToke = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN)
    
    // Send the generated tokens back in the response
    res.json({ accessToken: accessToken, refershToken: refershToke })
})


app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})
