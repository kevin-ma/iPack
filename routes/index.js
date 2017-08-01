var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index/index', {ipack:'home',title: 'iPack'});
});

module.exports = router;
