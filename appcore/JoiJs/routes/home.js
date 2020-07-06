const router = require('express').Router();
const User = require('../models/user');

router.get('/home', (req, res) => {
    const user = req.session.user;
    res.render('home',{
        user: user
    });
});

module.exports = router;