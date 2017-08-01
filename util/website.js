/**
 * Created by kevin on 2017/7/28.
 */

let web = require('../config/website.conf.json');
let fs = require('fs');

let filePath = process.cwd() + '/config/website.conf.json';

let website = {};

var websiteInfo = null;

function readFile() {
    if (!websiteInfo) {
        websiteInfo = JSON.parse(fs.readFileSync(filePath,'utf-8'));
    }
}

website.webname = function () {
    readFile();
    return websiteInfo.name;
};

website.url = function () {
    readFile();
    return websiteInfo.url;
};

website.installed = function () {
    readFile();
    return websiteInfo.install;
};

website.email = function () {
    readFile();
    return websiteInfo.email;
};

website.logo = function () {
    readFile();
    return websiteInfo.logo;
};

website.version = function () {
    readFile();
    return websiteInfo.version;
};

website.update = function (info,cb) {
    if (!info) {
        if (cb) {
            cb(null);
        }
        return;
    }
    let newInfo = {
        name : info.name || website.webname(),
        url : info.url || website.url(),
        install : info.install || website.installed(),
        email : info.email || website.email(),
        version : website.version(),
        logo : info.logo || website.logo()
    };
    fs.writeFile(filePath,JSON.stringify(newInfo),(err) => {
        websiteInfo = null;
        if (cb) {
            cb(err);
        }
    });
};

module.exports = website;