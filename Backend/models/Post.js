const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: String,
    content: String,
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    media: [
        {
            type: { type: String },
            url: String
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema);
