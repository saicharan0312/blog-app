const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const profileControllers = require("../controllers/profileControllers");

router.post(
    '/signup', 
    [
        check('name').not().isEmpty(),
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min:6 }),
    ],
    profileControllers.signup
)

router.post(
    '/login',
    [
        check('loginid').not().isEmpty(),
        check('password').isLength({min:6})
    ],
    profileControllers.login
)

router.post('/follow/:username', profileControllers.addFollowerAndFollowerPost);
router.get('/:username', profileControllers.getProfileById);
 
module.exports = router; 