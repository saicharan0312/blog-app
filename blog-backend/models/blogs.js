const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title : {
        type : String,
        required : true,
        minlength : 10
    },
    description : {
        type : String,
        required : true,
        minlength : 10
    },
    upvotes : [{
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User'
    }],
    comments : [{
        statement : {
            type : String,
            required : true
        },
        username : {
            type : mongoose.Types.ObjectId,
            required : true,
            ref : 'User'
        }
    }],
    creator : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

// const commentSchema = new Schema({
//     postid : {
//         type : String,
//         required : true,
//         ref : 'Blog'
//     },
//     username : {
//         type : String,
//         required : true,
//         ref : 'User'
//     },
//     comment : {
//         type : String,
//         required : true,
//         minlength : 2
//     }
// })

// {
//     statement : {
//         type : String,
//         required : true
//     },
//     username : {
//         type : mongoose.Types.ObjectId,
//         required : true
//     }
// }

function isMyFieldRequired (uniqueValidator) {
    return typeof this.myField === 'string'? false : true
}

module.exports = mongoose.model('Blog', blogSchema);
// module.exports = mongoose.model('Comment', commentSchema);