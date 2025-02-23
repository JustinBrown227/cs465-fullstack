const passport = require('passport');
require('../models/user'); 
const User = require('../models/user');


const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ "message": "All fields required" });
    }
        const user = new User( 
            {
            name: req.body.name,
            email: req.body.email,
            password: ''
        });

        user.setPassword(req.body.password); 
       const q = await user.save(); 

       if (!q)
       {
        return res
        .status
        .json(err);
       } else {
        const token = user.generateJWT();
        return res
        .status(200)
        .json(token);
       }
};
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ "message": "All fields required" });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log("Authentication error:", err); 
            return res.status(500).json({ message: 'An error occurred during authentication', error: err });
        }

        if (user) {
            const token = user.generateJWT();
            return res.status(200).json({ token });
        } else {
            console.log("Authentication info:", info); 
            return res.status(401).json(info);
        }
    })(req, res);
};


module.exports = {
    register,
    login
};
