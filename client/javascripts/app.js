var $ = require('jquery');
var Promise = require('bluebird');

$(document).ready(function(){

    var FB_ID = window.__env.FB_ID;
    var FB_ACCESS_TOKEN = window.__env.FB_ACCESS_TOKEN;

    //first request
    var fbEvents = $.ajax({
    url: 'https://graph.facebook.com/' + FB_ID + '/?fields=events&access_token=' + FB_ACCESS_TOKEN,
    method: 'GET'
    });

    //Bluebird promise
    Promise.resolve(fbEvents)
    //runs when fbEvents is fullfilled
      .then(function(results){
       console.log(results);
      })
    //handle errors
      .catch(function(err){
       console.log(err);
      })

 });