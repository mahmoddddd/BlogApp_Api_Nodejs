const User = require('../models/User')
const Post = require('../models/Post')
const router = require('express').Router()
const bycrypt = require('bcrypt');
const Category = require('../models/Category');



router.put('/:id', async (req, res) => {
    try {
        const existingUser = await User.findById(req.params.id);

        if (!existingUser) {
            return res.status(404).json("User not found");
        }

        if (req.body.userId === req.params.id) {
            if (req.body.password) {
                const salt = await bycrypt.genSalt(10);
                req.body.password = await bycrypt.hash(req.body.password, salt);
            }
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true } // Return the updated document
            );
            res.status(200).json(updatedUser);
            console.log('user info has been updated')
            // res.status(200).json(user);
        } else {
            res.status(403).json('You can update only your account');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});





router.delete('/:id', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        res.status(403).json('u can delete your account')
    }
    try {
        const user = await User.findById(req.params.id) //find user
        if (!user) {
            res.status(404).json('user not found')
        }
        // delete posts of user 
        await Post.deleteMany({ username: user.name })
        // delete the user 
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user and his posts has been deleted')
        console.log('deleted sucsesfuly')
    } catch (error) {
        res.status(500).json(error)
    }

})

//getAllUsers 
router.get('/alluser', async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        // Extracting usernames from user objects
        const usernames = users.map(user => `username : ${user.username}`); // give me all username of users
        res.status(200).json(usernames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






//getUser 
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }
        const { password, ...others } = user.toObject()
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})





module.exports = router;
