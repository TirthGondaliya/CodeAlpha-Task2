const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    posts: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
