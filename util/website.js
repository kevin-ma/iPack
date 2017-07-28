/**
 * Created by kevin on 2017/7/28.
 */

let web = require('../config/website.conf.json');
let fs = require('fs');

let filePath = process.cwd() + '/config/website.conf.json';

let website = {};

website.webname = function () {
    return web.name;
};

website.url = function () {
    return web.url;
};

website.installed = function () {
    return web.install;
};

website.email = function () {
    return web.email;
};

website.logo = function () {
    return web.logo;
};

website.version = function () {
    return web.version;
};

website.update = function (info,cb) {
    if (!info) {
        if (cb) {
            cb(null);
        }
        return;
    }
    let newInfo = {
        name : info.name || web.name,
        url : info.url || web.url,
        install : info.install || web.install,
        email : info.email || web.email,
        version : web.version,
        logo : info.logo || web.logo
    };
    fs.writeFile(filePath,JSON.stringify(newInfo),(err) => {
        delete require.cache[require.resolve('../config/website.conf.json')];
        if (cb) {
            cb(err);
        }
    });
};

module.exports = website;