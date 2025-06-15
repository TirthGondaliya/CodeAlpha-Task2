const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
});

router.post('/', async (req, res) => {
    try {
        const { userId, content, media } = req.body;
        const post = new Post({ userId, content, media });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

module.exports = router;
