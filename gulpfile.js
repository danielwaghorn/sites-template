var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');

var SASS_INCLUDE_PATHS = [
    './node_modules/foundation-sites/scss'
];

gulp.task('sass',function(){
    gulp.src(['app/scss/**/*.scss'])
        .pipe(sass({ includePaths: SASS_INCLUDE_PATHS }))
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
        .pipe(notify('SCSS Compiled'));
});

gulp.task('js',function(){
    var b = browserify({
		entries: './app/js/app.js',
		debug: true
	}).transform(babelify,
        { presets: ["es2015"] }
    );
	
	return b.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename({
       suffix: '.min'
    }))
    .pipe(uglify())
   	.on('error', gutil.log)	
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream())
        .pipe(notify('JavaScript Compiled'))
});

gulp.task('html',function(){
    gulp.src(['./app/*.html'])
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream())
        .pipe(notify('HTML Copied'))
});

gulp.task('watch', ['js','sass','html'], function(){
    browserSync.init({
        server: "./dist"
    });
    gulp.watch(['app/js/*.js', 'app/js/**/*.js'],['js']);
    gulp.watch('app/scss/**/*.scss',['sass']);
    gulp.watch('app/*.html',['html']);
    gulp.watch('app/assets/**/*',['image']);
});

gulp.task('default', ['js','sass','html','watch']);
