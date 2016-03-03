var gulp        = require('gulp');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var minifyCSS   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: '/dist'
    });
});

// Copy html files
gulp.task('copyHTML', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

// Build js files
gulp.task('compressJS', function() {
    gulp.src(['src/js/*.js'])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

// Build css files
gulp.task('compressCSS', function() {
    gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Watch files for changes & recompile
gulp.task('watch', function () {
    gulp.watch(['src/*.html'], ['copyHTML']);
    gulp.watch(['src/js/*.js'], ['compressJS']);
    gulp.watch(['src/css/*.scss'], ['compressCSS']);
});

// Default task, running just `gulp` will move font, compress js and scss, start server, watch files.
gulp.task('default', ['copyHTML', 'compressJS', 'compressCSS', 'browser-sync', 'watch']);