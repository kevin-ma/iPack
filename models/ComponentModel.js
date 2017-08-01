/**
 * Created by kevin on 2017/7/31.
 */

let model = require('./Model');

let Components = model.createModel({
    name : String,
    version : String,
    status : {type:Number,default:0}, // 0 正常  1 升级
    gitUrl : String,
    gitBranch:String,
    repo : {type :model.objId,ref:'Repos'},
    sendEmails : {type:}
    updateAt:{type:Number,default:model.DTI},
    createAt : {type : Number,default:model.DTI}
},'Components');

Components.getLoginInfo = function (username,callback) {
    Components.findOne({"$or":[{'username':username},{'email':username}]},null,null).exec(function (err,user) {
        if (callback) {
            callback(err,user);
        }
    })
};

Components.getbyId = function (id,callback) {
    Components.findById(id,'-passwd',null).exec(function (err,user) {
        if (callback) {
            callback(err,user);
        }
    })
};

module.exports = Components;