const express = require('express');
const router = express.Router();
const blogControllers = require("../controllers/blogControllers");
const { check } = require('express-validator');

router.post(
    '/write',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min : 10}),
    ],
    blogControllers.writeBlog
  );
router.post(
    '/like', 
    blogControllers.likeBlog
  );
router.post(
    '/comment',
    [
      check('comment').not().isEmpty()
    ],
    blogControllers.commentBlog
  );
router.get('/user/:username', blogControllers.getAllBlogsHome);
router.get('/:bid', blogControllers.getBlogById);

module.exports = router;

// http://localhost:5000/api/blogs/user/u2       to get all blogs following posts  GET
// http://localhost:5000/api/blogs/p1            to get specific bold details      GET
// http://localhost:5000/api/profile/follow/u2   to make follow req and add to his POST
// http://localhost:5000/api/profile/u2          to get posts of specific user     GET
