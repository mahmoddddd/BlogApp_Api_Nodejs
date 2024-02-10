const User = require('../models/User')
const Post = require('../models/Post')
const router = require('express').Router()
const bycrypt = require('bcrypt')

// CREAT NEW POST

router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})







//getAllPosts
router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find()
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' })
        }
        const sanitizedPosts = posts
            .map(post => {
                const { password, ...others } = post.toObject()
                return others;
            })
        res.status(200).json(sanitizedPosts)

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})



//getAllPost with category 
router.get('/', async (req, res) => {
    const { user, cat } = req.query;

    try {
        let posts;

        if (user) {
            posts = await Post.find({ username: user });
        } else if (cat) {
            posts = await Post.find({ categories: cat });
        } else {
            posts = await Post.find();
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//  Update post
router.put('/:id', async (req, res) => {
    try {
        const existingPost = await Post.findById(req.params.id);

        if (!existingPost) {
            return res.status(404).json("Post not found");
        }

        if (existingPost.author !== req.body.userId) { // the post to the owner user
            return res.status(403).json('You can update only your posts');
        }

        // u can use this logic tooo
        // if (existingPost.username !== req.body.username) {
        //     return res.status(403).json('You can update only your posts');
        // }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Return the updated document
        );

        console.log('post info has been updated');
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});



// DELETE POST   

router.delete('/:id', async (req, res) => {
    try {

        const post = Post.findById(req.params.id) // postId = req.params.id;
        if (!post) {
            return res.status(404).json('user not found')
        }

        if (post.auther !== req.body.userId) {
            return res.status.json(403).json('u can only delete your post')
        }
        res.status(200).json('the post deleted succesfuly')
        console.log('deleted success')
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
