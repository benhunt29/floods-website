var $ = require('jquery');
var Promise = require('bluebird');
var Handlebars = require('hbs');
var moment = require('moment');

$(document).ready(function(){

    $('.shows').hide();
    $(window).on('hashchange',function(){
       render(window.location.hash);
    });

    $(window).trigger('hashchange');

    var
        FB_ID = window.__env.FB_ID,
        FB_ACCESS_TOKEN = window.__env.FB_ACCESS_TOKEN;

    var shows = getShows();
    //displayShows(shows);

    function render(url){
        // Get the keyword from the url.
        var temp = url.split('/')[0];

        // Hide whatever page is currently shown.
        //$('.main-content .page').removeClass('visible');

        var map = {
            '': function(){
                $('.shows').hide();
            },
            '#shows': function(){
               $('.shows').show();
            }
        };

        if(map[temp]){
         map[temp]();
        }

    }

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
                    var currentShows = getCurrentShows(results.events.data);
                    displayShows(currentShows);
                }
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
           // console.log(moment(item.start_time).diff(moment().format()));
           //console.log(moment(item.start_time).format('MMMM DD YYYY'));
           console.log(currentShows);
        });

        return currentShows;
    }

    var $showsNav = $('#showsNav');

    $showsNav.on('click', function(){
       window.location.hash = 'shows';
    });

    function displayShows(data){
        var $showsDiv = $('.showDescriptions');

        var theTemplateScript = $("#shows-template").html();
        //Compile the template​
        var theTemplate = Handlebars.compile (theTemplateScript);
        $showsDiv.append (theTemplate(data));

    }


 });