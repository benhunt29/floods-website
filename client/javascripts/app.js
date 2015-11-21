var $ = require('jquery');
var Promise = require('bluebird');
var Handlebars = require('hbs');
var moment = require('moment');

"use strict";

$(document).ready(function(){

    var
        $showsDiv = $('.shows'),
        $showsNav = $('#showsNav'),
        $newsNav = $('#newsNav'),
        $newsDiv = $('.news');

    var
        FB_ID = window.__env.FB_ID,
        FB_ACCESS_TOKEN = window.__env.FB_ACCESS_TOKEN;

    (function init(){
        $showsDiv.hide();
        $newsDiv.hide();
        getShows();
    }());

    $showsNav.on('click', function(){
        window.location.hash = 'shows';
    });

    $newsNav.on('click', function(){
       window.location.hash = 'news';
    });

    $(window).on('hashchange',function(){
        render(window.location.hash);
    });

    function render(url){
        // Get the keyword from the url.
        var temp = url.split('/')[0];

        var map = {
            '': function(){
                $showsDiv.hide();
                $newsDiv.hide();
            },
            '#shows': function(){
                $newsDiv.hide();
                $showsDiv.show();
            },
            '#news': function(){
                $showsDiv.hide();
                $newsDiv.show();
            }
        };

        if(map[temp]){
         map[temp]();
        }
    }

    function getShows(){
        //ajax request to Facebook API
        var fbEvents = $.ajax({
            url: 'https://graph.facebook.com/' + FB_ID + '/?fields=events&access_token=' + FB_ACCESS_TOKEN,
            method: 'GET'
        });

        //Bluebird promise
        Promise.resolve(fbEvents)
            //runs when fbEvents is fullfilled
            .then(function(results){
                if(results){
                    var currentShows = getCurrentShows(results.events.data);
                    displayShows(currentShows);
                }
            })
            .then(function(){
                $(window).trigger('hashchange');
            })
            //handle errors
            .catch(function(err){
                console.log(err);
            });
    }

    function getCurrentShows(allShows){
        var currentShows = [],
            currentTime = moment().format();

        allShows.forEach(function(item){
            var showToDisplay = {};
            if(moment(item.start_time).diff(currentTime) > 0){
                showToDisplay.title = item.name;
                showToDisplay.date = moment(item.start_time).format('MMMM DD YYYY');
                showToDisplay.time = moment(item.start_time).format('hh:mm a');
                showToDisplay.venue = item.place.name;
                showToDisplay.city = item.place.location.city;
                showToDisplay.state = item.place.location.state;
                currentShows.push(showToDisplay);
            }
        });

        return currentShows;
    }

    function displayShows(data){
        var $showsDiv = $('.showDescriptions');

        var showsTemplateScript = $("#shows-template").html();
        //Compile the template​
        var showsTemplate = Handlebars.compile (showsTemplateScript);
        $showsDiv.append (showsTemplate(data));

    }


 });