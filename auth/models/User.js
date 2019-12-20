const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    birthday: {
        type: Date
    },

    phonenumber: {
        type: Number
    },

    name: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
       
    },

    gender: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);

module.exports =   User;