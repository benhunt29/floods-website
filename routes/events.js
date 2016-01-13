var express = require('express');
var router = express.Router();
var rp = require('request-promise');


/* GET events. */
router.get('/', function(req, res, next) {

	getShows()
		.then(function(data){
            res.json(data);
        })
});

function getShows(){

	var options = {
	    uri: 'https://graph.facebook.com/' + process.env.FB_ID + '/?fields=events&access_token=' + process.env.FB_ACCESS_TOKEN,
	    json: true // Automatically parses the JSON string in the response 
	};
 
	return rp(options)
    	.then(function (res) {
			return res;
    	})
    	.catch(function (err) {
            console.log(err);
    	});

}	

module.exports = router;
