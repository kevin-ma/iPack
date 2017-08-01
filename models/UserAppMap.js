/**
 * Created by kevin on 2017/7/28.
 */

let model = require('./Model');

let Users = model.createModel({
    username : String,
    nickname : String,
    email : String,
    passwd:String,
    admin : {type:Boolean,default:false},
    createAt : {type : Number,default:model.DTI}
},'Users');

Users.getLoginInfo = function (username,callback) {
    Users.findOne({"$or":[{'username':username},{'email':username}]},null,null).exec(function (err,user) {
        if (callback) {
            callback(err,user);
        }
    })
};

Users.getbyId = function (id,callback) {
    Users.findById(id,'-passwd',null).exec(function (err,user) {
        if (callback) {
            callback(err,user);
        }
    })
};

module.exports = Users;