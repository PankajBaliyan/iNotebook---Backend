const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

let JWT_TOKEN = process.env.JWT_TOKEN;

// ROUTER 1: Create a user using: POST "/api/auth/createuser" . Does not require auth
router.post(
    '/createuser',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be minium length 5').isLength({
            min: 5,
        }),
        body('name', 'Enter a valid name').isLength({ min: 3 }),
    ],
    async (req, res) => {
        let success = false;
        const result = validationResult(req);
        if (result.isEmpty()) {
            try {
                //Check for user, is it already exist or not
                let user = await User.findOne({ email: req.body.email });
                if (user) {
                    return res.status(400).json({
                        success,
                        error: 'Sorry, a user with this email already exist',
                    });
                }
                const salt = await bcrypt.genSalt(10); //generate salt
                const secPass = await bcrypt.hash(req.body.password, salt); //create password with salt
                //create new user
                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass,
                });
                const data = {
                    user: {
                        id: user.id,
                    },
                };
                const authToken = jwt.sign(data, JWT_TOKEN);
                success = true;
                res.json({ success, authToken });
            } catch (error) {
                console.log('Koi error hai, user bnane me');
                res.status(500).send('Some Error Occurred');
            }
        } else {
            return res.send({
                success,
                errors: result.array(),
            });
        }
    },
);

// ROUTER 2: Authentication a user using: POST "/api/auth/login" . Does not require auth
router.post(
    '/login',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password not be blank').exists(),
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const { email, password } = req.body;
            try {
                let user = await User.findOne({ email });
                if (!user) {
                    success = false;
                    return res.status(400).json({
                        success,
                        error: 'No user exist on this email',
                    });
                }
                const passwordCompare = await bcrypt.compare(
                    password,
                    user.password,
                );
                if (!passwordCompare) {
                    success = false;
                    return res.status(400).json({
                        success,
                        error: 'Wrong Password for this email',
                    });
                }
                const data = {
                    user: {
                        id: user.id,
                    },
                };
                const authToken = jwt.sign(data, JWT_TOKEN);
                success = true;
                res.json({ success, authToken });
            } catch (error) {
                console.log('Koi error hai, user login me');
                res.status(500).send('Internal Server Error');
            }
        } else {
            return res.send({ errors: result.array() });
        }
    },
);

// ROUTER 3: Get a user details using: POST "/api/auth/getUser" . Does not require auth
router.post('/getuser', fetchuser, async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        let userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } else {
        return res.send({ errors: result.array() });
    }
});

module.exports = router;
