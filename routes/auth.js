const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create a user using: POST "/api/auth/createuser" . Does not require auth
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
        const result = validationResult(req);
        if (result.isEmpty()) {
            try {
                //Check for user, is it already exist or not
                let user = await User.findOne({ email: req.body.email });
                if (user) {
                    return res.status(400).json({
                        error: 'Sorry, a user with this email already exist',
                    });
                }
                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                });
                res.json(user);
            } catch (error) {
                console.log('Koi error hai, user bnane me');
                res.status(500).send('Some Error Occurred');
            }
        } else {
            return res.send({ errors: result.array() });
        }
    },
);

module.exports = router;
