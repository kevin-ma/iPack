/**
 * Created by kevin on 2017/6/23.
 */
var express = require('express');
var router = express.Router();

let website = require('../util/website');
let database = require('../util/database');

/* GET home page. */
router.all('/*',function (req,res,next) {
    // if (website.url()) {
    //     return res.redirect('/');
    // }
    next();
});

router.post('/',function (req,res) {
    // 网站信息保存
    var url = req.body['url'];
    if (!url) {
        return res.json({
            code : -1,
            message : '请填写网站地址',
            data : null
        });
    }
    var urlComs = url.split('.');
    if (!(url.indexOf('http://') < 0 || url.indexOf('https://') < 0) || urlComs.length <= 0) {
        return res.json({
            code : -1,
            message : '请填写正确的网站地址',
            data : null
        });
    }

    // 数据库
    var dbport = req.body['dbport'] || '27017';
    var database = req.body['dbname'] || 'iPack';
    var username = req.body['dbuname'] || '';
    var host = req.body['dbhost'] || 'localhost';
    var passwd = req.body['dbupwd'] || '';

    var adminPwd = req.body['pwd'];
    var adminName = req.body['username'];
    if (!adminName || !adminPwd) {
        return res.json({
            code : -1,
            message : '请填写管理员信息',
            data : null
        });
    }
    var port = req.body['port'];
    var fullUrl = url;
    if (port) {
        fullUrl = url + ':' + port;
    }
    var u = urlComs[urlComs.length - 2];
    console.log(u);

    var t = u.split('//');
    var hostPart = t[t.length - 1]+urlComs[urlComs.length - 1];
    var info = {
        install : true,
        url : fullUrl,
        name : "iPack",
        email : hostPart
        };
    website.update(info,(err) => {
        if (err) throw err;
    });

    // 数据库信息保存

    db.config(host,dbport,database,username,passwd,function (err) {
        if (err) {
            res.json({
                code : -1,
                message : err.message || err.err,
                data : null
            });
        } else {
            var role = ({
                name : ' 全栈角色',
                permissions : {
                    packageA : true,
                    packageI : true,
                    managerA : true,
                    managerI : true
                }
            });
            Roles.createUniqueName(role,function (err,r) {
                if (err) {
                    return res.json({
                        message : err.message,
                        code : -1,
                        data : null
                    });
                } else {
                    var user = ({
                        username : adminName,
                        nickname : '管理员',
                        email : 'admin',
                        passwd : adminPwd,
                        role : r._id,
                        root : true
                    });
                    Users.createUnique(user,function (err) {
                        if (err) {
                            return res.json({
                                message : err.message,
                                code : -1,
                                data : null
                            });
                        } else {
                            return res.json({
                                message : '成功',
                                code : 0,
                                data : null
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/', function(req, res) {
    // 连接数据库
    database.connect(function (err) {
        if (err) {
            res.render('install/database',{title:'配置数据库'});
        } else {
            // 判断主账号是否存在

            res.render('install/database',{title:'配置数据库'});
        }
    });
});

module.exports = router;
