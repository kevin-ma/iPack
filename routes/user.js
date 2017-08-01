var express = require('express');
var router = express.Router();

let userModel = require('../models/UserModel');

/* GET users listing. */
router.get('/login', function(req, res) {
    let redirect = req.query.redirect || '/';
    res.render('user/login',{title:'用户登录', redirect : redirect,layout:'layout-empty.ejs'});
});

router.post('/login',function (req,res) {
    var username = req.body['username'];
    var password = req.body['password'];

    if (username.length === 0 || password.length === 0) {
        return res.json({
            message : '用户名、密码不能为空',
            code : -1,
            data : null
        });
    }
    userModel.getLoginInfo(username,function (err,user) {

        if (err || !user) {
            return res.json({
                message : '用户名或密码不正确',
                code : -1,
                data : null
            });
        }
        if ((password) === user.passwd) {
            req.session.uid = user._id;
            return res.json({
                message : '登录成功，正在跳转',
                code : 0,
                data : null
            });
        } else {
            return res.json({
                message : '密码不正确',
                code : -1,
                data : null
            });
        }
    })
});

router.get('*',function (req,res,next) {
     if (res.locals.user) {
         next();
     } else {
         req.flash('error', '请先登录');
         res.redirect('/user/login?redirect='+req.originalUrl);
     }
});

router.get('/center/:nickname',function (req,res) {
    let nickname = req.params.nickname;
    if (nickname === res.locals.user.nickname) {
        res.render('user/center', {ipack:'userCenter',title: res.locals.user.nickname,uid: res.locals.user._id});
    } else {
        req.flash('error', '访问拒绝');
        res.redirect('/user/' + res.locals.user.nickname);
    }
});

module.exports = router;
