'use strict';

// dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    merge = require('merge-stream');

var config = {
    paths: {
        publicjs: './public/javascripts',
        client: './client',
        clientjs: ['./client/javascripts/app.js'],
        sass: './client/sass/*.scss',
        css: './public/stylesheets/',
        clientImages: './client/images/*.png',
        clientViews: './client/views/*.html',
        publicImages: './public/images',
        publicViews: './public'
    }
};

gulp.task('default', ['sass', 'browserify', 'copy'],
    function(){
        gutil.log('Gulped!');
    });

gulp.task('copy', function(){
   var images = gulp.src(config.paths.clientImages)
        .pipe(gulp.dest(config.paths.publicImages));
   var views =  gulp.src(config.paths.clientViews)
        .pipe(gulp.dest(config.paths.publicViews));

    return merge(images,views);

});

gulp.task('browserify', function(){
    return browserify(config.paths.clientjs).bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.publicjs));
});

gulp.task('sass', function () {
   return gulp.src(config.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.paths.css));
});




