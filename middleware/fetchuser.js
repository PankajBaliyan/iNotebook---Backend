let jwt = require('jsonwebtoken');

let JWT_TOKEN = process.env.JWT_TOKEN;

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({
            error: 'Please authenticate using a valid token',
        });
    }
    try {
        if (!JWT_TOKEN) {
            throw new Error('JWT_TOKEN is not defined');
        }
        const data = jwt.verify(token, JWT_TOKEN);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Please authenticate using a valid token',
        });
    }
};

export default fetchuser;
