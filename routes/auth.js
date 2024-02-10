const User = require('../models/User')
const router = require('express').Router()
const bycrypt = require('bcrypt')


// post request to register
router.post('/register', async (req, res) => {
    try {
        const salt = await bycrypt.genSalt(10)
        const passwordHash = await bycrypt.hash(req.body.password, salt)
        const newUSer = new User({
            username: req.body.username,
            email: req.body.email,
            password: passwordHash // hashing here  
        })

        const user = await newUSer.save()
        res.status(200).json(user)
        console.log('you sign up susesfuly')
    } catch (error) {
        res.status(500).json(error)
    }
})



router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            console.log("User not found");
            return res.status(400).json("Wrong Email!");
        }

        const validatePassword = await bycrypt.compare(req.body.password, user.password);

        if (!validatePassword) {
            console.log("Invalid Password");
            return res.status(400).json("Wrong Password!");
        }

        const { password, ...others } = user.toObject(); // to object here to give me all object only
        console.log("Login Successful");
        res.status(200).json(others);

    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

});



module.exports = router