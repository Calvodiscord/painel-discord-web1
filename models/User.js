const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['admin', 'owner'], default: 'admin' },
    isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
