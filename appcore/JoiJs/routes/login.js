const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // res.send(passwordHash);

    //find in db
    const user = await User.findOne({username: username}).then((user) => {
        if(!user){
            res.send('username not success');
        }
        else{
            bcrypt.compare(password, user.password, (err, result) => {
                if(result ===true){
                    req.session.user = user;
                    res.redirect('/home');
                }
                else{
                    res.json({"login": "login failed"});
                }
            });
        }
    });
})

module.exports = router;