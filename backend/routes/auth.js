import express from 'express';
import User from '../models/User.js';
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchUser from '../middleware/fetchUser.js'; // Middleware code

const JWT_SECRET = "Iam$goodboy";
const router = express.Router();


// ROUTE 1: Create a New User using POST "api/auth/createuser". Doesn't require auth.
router.post('/createuser', [
    body("name", "Enter a valid name").isLength({ min:3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 })

], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array() })
    }

    try {
        let user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(400).json({error: "User with this email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        res.status(200).json({message: "User creation successful"});
    }

    catch (error) {
        console.error(error);
        res.status(400).send("Some Error Occured");
    }

});

// ROUTE 2: Authenticate a User using POST "api/auth/login". No login Required.
router.post("/login", [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).send("Please login with correct credentials");
        }

        let passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            return res.status(400).send("Please login with correct credentials");
        }

        const data = {
            user: { id: user.id }
        }

        let authToken = await jwt.sign(data, JWT_SECRET);
        res.json({authToken: authToken });

    }

    catch(error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3: Get logged in User Details using: POST: "api/auth/getuser". Login required
router.post("/getuser", fetchUser, async (req, res) => {
    
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("password");
        res.send(user);
    }

    catch(error) {
        console.error(error);
    res.status(500).send("Internal Server Error");
    }

});



export default router;
