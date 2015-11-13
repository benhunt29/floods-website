var $ = require('jquery');
var Promise = require('bluebird');
var Handlebars = require('hbs');

$(document).ready(function(){

    var
        FB_ID = window.__env.FB_ID,
        FB_ACCESS_TOKEN = window.__env.FB_ACCESS_TOKEN;

    var shows = getShows();
    //displayShows(shows);

    function getShows(){
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
                if(results){
                    displayShows(results.events.data);
                }
            })
            //handle errors
            .catch(function(err){
                console.log(err);
            });

    }

    function displayShows(data){
        var $showsDiv = $('.showDescriptions');

        var theTemplateScript = $("#shows-template").html();
        //Compile the template​
        var theTemplate = Handlebars.compile (theTemplateScript);
        $showsDiv.append (theTemplate(data));

    }


 });