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
        $newsDiv = $('.news'),
        $backgroundImage = $('#bgd');

    (function init(){
        setBackground();
        $showsDiv.hide();
        $newsDiv.hide();
        getShows();
        getNews();
    }());

    function setBackground () {
      $backgroundImage.css('backgroundImage', 'url(' + 'images/background' + getRandomIntInclusive(1,5) + '.jpeg)')
    }

    $('body').on('click', setBackground);

    function getRandomIntInclusive(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    function getNews(){
        //ajax request to Facebook API
        var news = $.ajax({
            url: '/api/news',
            method: 'GET'
        });

        //Bluebird promise
        Promise.resolve(news)
            //runs when fbEvents is fullfilled
            .then(function(results){
                if(results){
                    displayNews(results);
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

    function displayNews(data){
        var $newsDiv = $('.newsDescriptions');

        var newsTemplateScript = $("#news-template").html();
        //Compile the template​
        var newsTemplate = Handlebars.compile (newsTemplateScript);
        $newsDiv.append (newsTemplate(data));

    }

    function getShows(){
        //ajax request to Facebook API
        var fbEvents = $.ajax({
            url: '/api/events',
            method: 'GET'});
        //Bluebird promise
        Promise.resolve(fbEvents)
            //runs when fbEvents is fullfilled
            .then(function(results){
                if(results){
                    var allShows = getAllShows(results.events.data);
                    displayShows(allShows);
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

    function getAllShows(allShows){
        var showsArray = [],
            currentTime = moment().format();

        allShows.forEach(function(item){
            var showToDisplay = {};
                showToDisplay.title = item.name;
                showToDisplay.date = moment(item.start_time).format('MMMM DD YYYY');
                showToDisplay.time = moment(item.start_time).format('hh:mm a');
                showToDisplay.venue = item.place.name;
                showToDisplay.city = item.place.location.city;
                showToDisplay.state = item.place.location.state;
                showsArray.push(showToDisplay);
        });

        // sort by date
        showsArray.sort(function(a, b){
          var date1 = moment(a.date, 'MMMM DD YYYY'),
              date2 = moment(b.date, 'MMMM DD YYYY');
          if (date1.isAfter(date2)) return -1;
          else if (date1.isBefore(date2)) return 1;
          else return 0;
        })
        return showsArray;
    }

    function displayShows(data){
        var $showsDiv = $('.showDescriptions');

        var showsTemplateScript = $("#shows-template").html();
        //Compile the template​
        var showsTemplate = Handlebars.compile (showsTemplateScript);
        $showsDiv.append (showsTemplate(data));

    }
 });
