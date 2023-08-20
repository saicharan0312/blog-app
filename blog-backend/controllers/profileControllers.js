const { validationResult } = require('express-validator');
const { default : mongoose } = require('mongoose');

const User = require("../models/user");

let dummy_profile = [
    {
        id: "u1",
        name : "sai",
        email : "sai@gmail.com",
        password : "sai0312",
        bio : "hey I'm Sai",
        followers : ["u2","u3"],
        following : ["u2"],
        followingPost : ["p2,p3"],
        blogs : ["p1"]
    },
    {
        id: "u3",
        name : "sai1",
        email : "sai1@gmail.com",
        password : "sai0312",
        bio : "hey I'm Sai",
        followers : ["u1"],
        following : ["u1","u2"],
        followingPost : ["p1","p2","p3"],
        blogs : ["p4"]
    },
    {
        id: "u2",
        name : "sai0",
        email : "sai0@gmail.com",
        password : "sai0312",
        bio : "hey I'm Sai",
        followers : ["u3"],
        following : ["u1"],
        followingPost : ["p1"],
        blogs : ["p2", "p3"]
    }
]

const signup = async (req, res, next) => {
    const error = validationResult(req.body);
    if(!error.isEmpty()) {
        return res.json({"error": "some feilds are missing"})
    }
    const { name,  username, email, password, bio } = req.body;
    let userEmailExist;
    // console.log(name, "  " , username, "  " , email);
    try {
        userEmailExist = await User.findOne({
            email : email
        })
    } catch(err) {
        // console.log(err);
        return res.json({"error" : "error occured while fetching email"})
    }
    let userNameExist;
    try {
        userNameExist = await User.findOne({
            email : email
        })
    } catch {
        return res.json({"error" : "error occured while fetching"})
    }
    if(userEmailExist) {
        return res.json({"message" : "user name alreay exist"});
    }
    const newUser = new User({
        name,
        username, 
        email,
        password,
        bio,
        followers : [],
        following : [],
        followingPost : [],
        blogs : [],
    });

    try {
        newUser.save();
    } catch(err) {
        return res.json({"message": "creating user failed"});
    }
    return res.json({"user" : newUser});
}

// done
const login = async (req, res, next) => {
    const error = validationResult(req.body);
    // console.log("login id" , req.body);
    //console.log(error);
    if(!error.isEmpty()) {
        return res.json({"message" : "not a valid email or phone or username or short password"});
    }
    const {loginid, passowrd} = req.body;
    // console.log("login id" , loginid);
    let userEmailExist;
    let userUsernameExist;
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        userEmailExist = await User.findOne({email : loginid});
        userUsernameExist = await User.findOne({username : loginid});
        await  session.commitTransaction();
    } catch(err) {
        return res.json({"message" : "fetch failed please try after some time"});
    }
    if(!userEmailExist && !userUsernameExist) {
        return res.json({"message" : "user id dosent exist"});
    }
    if(userEmailExist.passowrd  !== passowrd) {
        return res.json({"message" : "slogin failed"});
    }
    return res.json({"message" : "success login", user : userEmailExist});
} 

const getProfileById = async (req, res, next) => {
    const userId = req.params.username;
    let user;
    try {
        user = await User.findOne({username : userId});
    } catch(err) {
        // console.log("error", err);
        return res.json({ "message" : "unabel to fetch user" });
    }
    if(user.username === userId) {
        return res.json({"user" : user}); 
    }
    return res.json({"message" : "user not found"});
}

const addFollowerAndFollowerPost = async (req, res, next) => {

    // bugs to be fixed when he click button again it should not add to follow and follower
    const { toBeFollowUser, currentUser } = req.body;
    if(!currentUser) {
        return res.json({"message" : "please login"});
    }

    let toBeFollowUserExist;
    try {
        currentUserExist = await User.findOne({ username : currentUser });
    } catch(err) {
        return res.json({"message" : "fecth failed"});
    }
    try {
        toBeFollowUserExist = await User.findOne({ username : toBeFollowUser });
    } catch(err) {
        return res.json({"message" : "fetch failed"});
    }
    if(!currentUserExist) {
        return res.json({"message" : "please login"});
    }
    if(!toBeFollowUserExist) {
        return res.json({"message" : "user does not exist to be followed"});
    }

    currentUserExist.following.push(toBeFollowUserExist._id);
    toBeFollowUserExist.followers.push(currentUserExist._id);

    currentUserExist.followingPost =  currentUserExist.followingPost.concat(toBeFollowUserExist.blogs);

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await currentUserExist.save();
        await toBeFollowUserExist.save();
        session.commitTransaction();

    } catch(err) {
        return res.json({"message" : "follo failed"})
    }
    res.json({"update user details" : currentUserExist});
}

exports.getProfileById = getProfileById;
exports.addFollowerAndFollowerPost = addFollowerAndFollowerPost;
exports.signup = signup;
exports.login = login;

// follow request User
// {
//     "toBeFollowUser" : "sai1",
//     "currentUser" : "sai2" 
// }


