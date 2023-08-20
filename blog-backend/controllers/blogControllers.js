const express = require('express');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const  Blog  = require('../models/blogs');
const  User  = require('../models/user');
const { default : mongoose } = require('mongoose');
const user = require('../models/user');

let dummy_blogs = [
    {
        id : "p1",
        title : "JavaScript",
        description : "JavaScript Description",
        upvotes : 10,
        coments : [],
        creator : "u1"
    },
    {
        id : "p2",
        title : "C sharp",
        description : "C Sharp Description",
        upvotes : 10,
        coments : ["good", "bad"],
        creator : "u2"
    },
    {
        id : "p3",
        title : "C ",
        description : "C  Description",
        upvotes : 10,
        coments : ["good", "bad", "nice"],
        creator : "u2"
    },
    {
        id : "p4",
        title : "Java ",
        description : "Java Description",
        upvotes : 10,
        coments : ["good", "bad", "nice"],
        creator : "u3"
    },
]

let dummy_profile = [
    {
        id: "u1",
        name : "sai",
        email : "sai@gmail.com",
        password : "sai0312",
        bio : "hey I'm Sai",
        followers : ["u2","u3"],
        following : ["u2"],
        followingPost : ["p2","p3"],
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

const getAllBlogsHome = async (req, res, next) => {
    const { userId }= req.body;
    // console.log("userId", userId);
    let userExist;
    try {
        userExist = await User.findOne({ username : userId });
    } catch(err) {
        return res.json({"message" : "unable to fetch"});
    }

    if(!userExist) {
        return res.json({"message" : "user dose not exist"});
    }
    const listOfPostsIDsToDisplay = userExist.followingPost;
    if(listOfPostsIDsToDisplay.length === 0) {
        return res.json({"message" : "follow someone to see some posts"});
    }
    // console.log("user = " ,userExist);
    // console.log("post IDs", listOfPostsIDsToDisplay);
    // bug to be fixed not just getting the IDs need all details of posts
    return res.json({"loaded posts" : listOfPostsIDsToDisplay });
}

const getBlogById = async (req, res, next) => {
    const blogId = req.params.bid;
    let postExist;
    try {
        postExist = await Blog.findById(blogId);
    } catch(err) {
        return res.json({"message" : "could not able to fetch"});
    }
    if(!postExist) {
        return res.json({"message" : "post doesn't exist"});
    }
    return res.json({"post" : postExist});
};

const writeBlog = async (req, res, next) => {

    const error = validationResult(req.body);
    if(!error.isEmpty()) {
        return res.json({"message" : "invalid inputs"});
    }
    const {title, description} = req.body;
    const username = "sai5";

    let userExist;
    try {
        userExist = await User.findOne({username : username});
    } catch(err) {
        return res.json({"message" : "creating blog failed"});
    }
    if(!userExist) {
        return res.json({"message" : "cannot find user to post"});
    }
    const createBlog = new Blog({
        title,
        description,
        upvotes : [],
        comments : [],
        creator : userExist._id,
    });
    // console.log("createdBlog", createBlog);
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createBlog.save({session : session});
        userExist.blogs.push(createBlog);
        updateUsersOfFollowers = userExist.followers;
        // console.log("user = ", updateUsersOfFollowers);
        updateUsersOfFollowers.map(async (user) => {
            let userItem = await User.findOne(user);
            // console.log("userItem", userItem);
            userItem.followingPost.push(createBlog);
            await userItem.save({session : session});
        });
        await userExist.save({session : session});
        await session.commitTransaction();

    } catch(err) {
        // console.log(err);
        return res.json({"message" : "unable to post try again"});
    }
    return res.json({"place" : createBlog});
}

const likeBlog = async (req, res, next) => {
    const { postid, likedUser } = req.body;
    let postExist;
    let likedUserExist;
    try {
        postExist = await Blog.findOne({ _id : postid });
    } catch(err) {
        // console.log("err1" ,  err);
        return res.json({"message" : "error while checking existing post"});
    }
    try {
        likedUserExist = await User.findOne({ username : likedUser });
    } catch(err) {
        // console.log("err2" ,  err);
        return res.json({"message" : "error while checking existing user Liked"});
    }

    if(!postExist || !likedUserExist) {
        // console.log("err3" ,  err);
        return res.json({"message" : "user ot post does not exist"});
    }
    const likes = postExist.upvotes;
    const likedAlready = likes.includes(likedUserExist._id)
    if(likedAlready) {
        return res.json({"message" : "you already upvoted post"});
    }
    else {
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            postExist.upvotes.push(likedUserExist._id);
            await postExist.save({session : session});
            session.commitTransaction()
        } catch(err) {
            // console.log("err4" ,  err);
            return res.json({"message" : "something went wrong please like again"});
        }
    }
    return res.json({"message" : "successfully likes the post"});
}

const commentBlog = async (req, res, next) => {
    const error = validationResult(req.body);
    if(!error.isEmpty()) {
        return res.json({"message" : "comment cannot be empty"});
    }
    const { comment, postid, commentedUser } = req.body;

    let postExist;
    let commentedUserExist;
    try {
        postExist = await Blog.findOne({ _id : postid });
    } catch(err) {
        // console.log("err1" ,  err);
        return res.json({"message" : "error while checking existing post"});
    }
    try {
        commentedUserExist = await User.findOne({ username : commentedUser });
    } catch(err) {
        // console.log("err2" ,  err);
        return res.json({"message" : "error while checking existing user Liked"});
    }

    if(!postExist || !commentedUserExist) {
        // console.log("err3" ,  err);
        return res.json({"message" : "user ot post does not exist"});
    }
    const addNewComment = {
        statement : comment,
        username : commentedUserExist._id
    }
    // console.log("commentedUserExist", commentedUserExist );
    // console.log("post exist" , postExist);

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        postExist.comments.push(addNewComment);
        await postExist.save({session : session});
        session.commitTransaction()
    } catch(err) {
        // console.log("err4" ,  err);
        return res.json({"message" : "something went wrong please comment again"});
    }

    return res.json({"message" : "successfully commented", "post" : postExist});
}

exports.getBlogById = getBlogById;
exports.getAllBlogsHome = getAllBlogsHome;
exports.writeBlog = writeBlog;
exports.likeBlog = likeBlog;
exports.commentBlog = commentBlog;

// signup
// {
//     "name": "user6",
//     "username": "sai6",
//     "email": "sai6@gmail.com",
//     "password": "sai0312",
//     "bio": "hey I'm Sai 06"
// }


// to post a like
// {
//     "postid" : "64e039205a3f9cb155490035",
//     "likedUser" : "sai2"
// }

// to post a comment
// {
//     "postid" : "64e039205a3f9cb155490035",
//     "comment" : "this is my 1st comment to sai2",
//     "commentedUser" : "sai2"
// }

// to create new post
// {
//     "title" : "my 1st post title on sai2",
//     "description" : "my 1st description on sai2"
// }