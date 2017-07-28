/**
 * Created by kevin on 2017/7/28.
 */

let dbConfig = require('../config/database.conf.json');
let fs = require('fs');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let database = {};

database.host = function () {
    return dbConfig.host;
};

database.port = function () {
    return dbConfig.port;
};

database.database = function () {
    return dbConfig.database;
};

database.username = function () {
    return dbConfig.username;
};

database.passwd = function () {
    return dbConfig.passwd;
};

/*
 * 写入数据库信息
*/
database.config = function (host,port,dbname,username,passwd,callback) {
    database.connectConfig(host,port,dbname,username,passwd,function (error) {
        if (error) {
            if (callback) {
                callback(error);
            }
        } else  {
            let info = {
                host : host,
                port : port,
                database : dbname,
                username : username,
                passwd : passwd
            };
            fs.writeFile('./config/database.conf.json',JSON.stringify(info),callback);
        }
    });
};

/* 通过读取的配置连接数据库 */
database.connectConfig = function (host,port,dbname,username,passwd,callback) {
    let content = 'mongodb://';
    if (username && passwd) {
        username = username.replace(/@/g,'%40');
        passwd = passwd.replace(/@/g,'%40');
        content += (username + ':' + passwd + '@');
    }
    content += host;
    if (port) {
        content += (':' + port);
    }
    content += ('/' + dbname);

    database.disconnect();
    process.nextTick(function () {
        mongoose.connect(content);
        let con = mongoose.connection;
        if (callback) {
            con.once('error', function (err) {
                callback(new Error('无法连接到数据库，请检查数据库配置'));
            });
            con.once('open',function (data) {
                console.log('已连接到数据库');
                callback(null);
            });
        }
    });
};

/*
 * 读取数据库并连接数据库
 * 回调 （err）
 */
database.connect = function (callback) {
    fs.readFile(process.cwd() + '/config/database.conf.json','utf8',function (err,data) {
        if (err) {
            if (callback) {
                callback(err);
            }
        }
        data = JSON.parse(data);
        if (data.host && data.database) {
            database.connectConfig(data.host,data.port,data.database,data.username,data.passwd,callback);
        } else {
            if (callback) {
                callback(new Error('无法连接到数据库，请检查数据库配置'));
            }
        }
    });

};

database.disconnect = function () {
    if (mongoose.connection) {
        mongoose.disconnect();
    }
};

module.exports = database;