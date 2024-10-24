const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: String,
    password: String 
});

const GoogleUser = mongoose.model('GoogleUser', userSchema);

module.exports = GoogleUser;
