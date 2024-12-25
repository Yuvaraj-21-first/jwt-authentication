require('dotenv').config()
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json())  // Parse incoming JSON requests
const port = process.env.PORT  // Port for the server

// Sample list of users
const usersList = [
    { id: 201, name: 'yuvaraj' },
    { id: 202, name: 'raj' }
];

// Route to fetch users based on authenticated user
app.get('/users', authenticateJWT, (req, res) => {
    console.log(req.user)  // Log decoded user info
    res.json(usersList.filter(user => user.name === req.user.name))  // Return matching user
});

// Route to generate JWT token for the user
app.post('/getInformation', (req, res) => {
    const userName = req.body.userName  // Get user name from request body
    const accessToken = jwt.sign({ name: userName }, process.env.ACCESS_SECRET_TOKEN)  // Generate token
    res.json({ accessToken })  // Return the token
});

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const authorization = req.header('Authorization');  // Get Authorization header
    const token = authorization && authorization.split(' ')[1];  // Extract token

    if (!token) return res.sendStatus(401);  // If no token, send 401 Unauthorized

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);  // If invalid token, send 403 Forbidden
        req.user = user;  // Attach user to request object
        next();  // Proceed to next middleware/route
    });
}

// Start the server
app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
