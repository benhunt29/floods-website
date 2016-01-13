var express = require('express');
var router = express.Router();
var news = require('../model/news.json');

/* GET events. */
router.get('/', function(req, res, next) {

	res.json(news.news);
});

module.exports = router;
