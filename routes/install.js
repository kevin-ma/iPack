/**
 * Created by kevin on 2017/6/23.
 */
var express = require('express');
var router = express.Router();

let website = require('../util/website');
let database = require('../util/database');
let userModel = require('../models/UserModel');

require('../util/string');

/* GET home page. */
router.all('/*',function (req,res,next) {
    // if (website.url()) {
    //     return res.redirect('/');
    // }
    next();
});

router.post('/database',function (req,res) {
    let dbport = req.body['dbport'] || '27017';
    let dbname = req.body['dbname'] || 'iPack';
    let username = req.body['dbuname'] || '';
    let host = req.body['dbhost'] || 'localhost';
    let passwd = req.body['dbupwd'] || '';

    database.config(host,dbport,dbname,username,passwd,function (err) {
        if (err) {
            res.json({
                code : -1,
                message : err.message,
                data : null
            });
        } else {
            res.json({
                code : 0,
                message : '成功',
                data : null
            });
        }
    });
});

router.post('/other',function (req,res) {
    let url = req.body['url'] || 'https://ipack.pub';
    let name = req.body['name'] || 'iPack移动服务平台';
    let username = req.body['username'];
    let passwd = req.body['pwd'];
    let email = req.body['email'] || 'ipack.pub';
    let passwdAgain = req.body['pwdAgain'] || '';
    // 非用户信息
    if (!url) {
        return res.json({
            code : -1,
            message : '请填写网站地址',
            data : null
        });
    }
    let urlComs = url.split('.');
    if (!(url.indexOf('http://') < 0 || url.indexOf('https://') < 0) || urlComs.length <= 0) {
        return res.json({
            code : -1,
            message : '请填写正确的网站地址',
            data : null
        });
    }
    website.update({
        url : url,
        name : name,
        email : email
    },function (e) {
        if (e) {
            res.json({
                code : -1,
                message : e.message
            })
        } else {
            // 用户信息
            if (!username) {
                return res.json({
                    code : -1,
                    message : '请填写管理员用户名',
                    data : null
                });
            }
            if (!passwd || passwd.length < 6 || passwd.upperCaseFirst() !== passwd ) {
                return res.json({
                    code : -1,
                    message : '密码格式错误，不少于6个字符，并且第1个字符为大写字母',
                    data : null
                });
            }
            if (passwd !== passwdAgain) {
                return res.json({
                    code : -1,
                    message : '两次输入的密码不一致',
                    data : null
                });
            }
            let user = {
                passwd : passwd,
                username : username,
                nickname : '管理员',
                admin : true,
                email : 'admin'
            };
            userModel.create(user,function (err,data) {
                if (err) {
                    return res.json({
                        code : -1,
                        message : err.message,
                        data : null
                    });
                }
                website.update({install:true},function (e) {
                    if (e) {
                        return res.json({
                            code : -1,
                            message : e.message,
                            data : null
                        });
                    }
                    return res.json({
                        code : 0,
                        message : '成功',
                        data : null
                    });
                })

            });
        }
    })

});

router.post('/',function (req,res) {
    // // 网站信息保存
    // var url = req.body['url'];
    // if (!url) {
    //     return res.json({
    //         code : -1,
    //         message : '请填写网站地址',
    //         data : null
    //     });
    // }
    // var urlComs = url.split('.');
    // if (!(url.indexOf('http://') < 0 || url.indexOf('https://') < 0) || urlComs.length <= 0) {
    //     return res.json({
    //         code : -1,
    //         message : '请填写正确的网站地址',
    //         data : null
    //     });
    // }
    //
    // // 数据库
    // var dbport = req.body['dbport'] || '27017';
    // var database = req.body['dbname'] || 'iPack';
    // var username = req.body['dbuname'] || '';
    // var host = req.body['dbhost'] || 'localhost';
    // var passwd = req.body['dbupwd'] || '';
    //
    // var adminPwd = req.body['pwd'];
    // var adminName = req.body['username'];
    // if (!adminName || !adminPwd) {
    //     return res.json({
    //         code : -1,
    //         message : '请填写管理员信息',
    //         data : null
    //     });
    // }
    // var port = req.body['port'];
    // var fullUrl = url;
    // if (port) {
    //     fullUrl = url + ':' + port;
    // }
    // var u = urlComs[urlComs.length - 2];
    // console.log(u);
    //
    // var t = u.split('//');
    // var hostPart = t[t.length - 1]+urlComs[urlComs.length - 1];
    // var info = {
    //     install : true,
    //     url : fullUrl,
    //     name : "iPack",
    //     email : hostPart
    //     };
    // website.update(info,(err) => {
    //     if (err) throw err;
    // });
    //
    // // 数据库信息保存
    //
    // db.config(host,dbport,database,username,passwd,function (err) {
    //     if (err) {
    //         res.json({
    //             code : -1,
    //             message : err.message || err.err,
    //             data : null
    //         });
    //     } else {
    //         var role = ({
    //             name : ' 全栈角色',
    //             permissions : {
    //                 packageA : true,
    //                 packageI : true,
    //                 managerA : true,
    //                 managerI : true
    //             }
    //         });
    //         Roles.createUniqueName(role,function (err,r) {
    //             if (err) {
    //                 return res.json({
    //                     message : err.message,
    //                     code : -1,
    //                     data : null
    //                 });
    //             } else {
    //                 var user = ({
    //                     username : adminName,
    //                     nickname : '管理员'
    //                     email : 'admin',
    //                     passwd : adminPwd,
    //                     role : r._id,
    //                     root : true
    //                 });
    //                 Users.createUnique(user,function (err) {
    //                     if (err) {
    //                         return res.json({
    //                             message : err.message,
    //                             code : -1,
    //                             data : null
    //                         });
    //                     } else {
    //                         return res.json({
    //                             message : '成功',
    //                             code : 0,
    //                             data : null
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
});

router.get('/', function(req, res) {
    let step = req.query.step;
    // 连接数据库
    database.connect(function (err) {
        if (err) {
            step = 1;
        } else {
            step = step || 2;
        }
        step = parseInt(step);
        if (step === 2) {
            res.render('install/other',{title:'欢迎使用iPack',layout:'layout-empty.ejs'});
        } else {
            res.render('install/database',{title:'欢迎使用iPack',layout:'layout-empty.ejs'});
        }
    });
});

module.exports = router;
