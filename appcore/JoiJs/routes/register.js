 const router = require('express').Router();
 const Joi = require('@hapi/joi')
 const passport = require('passport');

 const User = require('../models/user');

//validation schema

const userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).max(10).required(),
    confirm: Joi.any().valid(Joi.ref('password')).required()
});

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', async (req, res) => {
  
    const result = userSchema.validate(req.body);
    
     const user = await User.findOne({ 'email': result.value.email });
     if(user){
        res.send('email is already in use');
    }
    else{
        const hash = await User.hashPassword(result.value.password);
        result.value.password = hash;
        const newUser = await new User(result.value);
        await newUser.save();
        res.send('save user success'); 
    }
})

// router.route('/register')
//     .get((req,res) =>{
//         res.render('register');
//     })
//     .post(async (req, res, next) =>{
//         try{
//             const result = Joi.validate(req.body, userSchema);
//             if(result.error){
//                 req.flash('error data');
//                 res.redirect('/register');
//                 return
//             }
//             const user = await User.findOne({ 'email': result.value.email });
//             if(user){
//                 req.flash('error', 'Email is already in use');
//                 res.redirect('/register');
//                 return
//             }

//             //hash password 
//             const hash = await User.hashPassword(result.value.password);
            
//             delete result.value.confirmPassword
//             result.value.password = hash;

//             //save to db
//             const newUser = await new User(result.value);
//             await newUser.save();

//             req.flash('register success');
//         } catch(error){
//             next(error);
//         }
//     });


 module.exports = router;