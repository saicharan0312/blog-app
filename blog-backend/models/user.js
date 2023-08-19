const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        minlenght : 6
    },
    bio : {
        type : String,
        required : isMyFieldRequired(),
    },
    followers : [{
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User'
    }],
    following : [{
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User'
    }],
    followingPost : [{
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'Blog'
    }],
    blogs : [{
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'Blog'
    }],
});

function isMyFieldRequired (uniqueValidator) {
    return typeof this.myField === 'string'? false : true
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

