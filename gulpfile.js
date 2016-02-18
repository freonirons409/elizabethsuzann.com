var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var notify = require('gulp-notify');
var prefix = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var iconfont = require('gulp-iconfont');
var sourcemaps = require('gulp-sourcemaps');
var iconfontCss = require('gulp-iconfont-css');
var fontName = 'Icons';
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-cssnano');
// var spritesmith = require('gulp.spritesmith');
var fs = require('fs');
var fileinclude = require('gulp-file-include');
var path = require('path');
var rev = require('gulp-rev');
var del = del = require('del');
var cache = require('gulp-cache');

var sourcemaps = require('gulp-sourcemaps');

// var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

//needed becaues current gulp-sass errors with source maps on windows
var processWinPath = function(file) {
    
    if (process.platform === 'win32') {
        file.path = path.relative('.', file.path);
        file.path = file.path.replace(/\\/g, '/');
    }
};
gulp.task("name", function() {
    console.log(path.basename(__dirname));
});
//clean out that mothafuckin' dist folder
gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img']);
});

// Image compression
gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});

//build bower/foundation scss files
gulp.task("build-css", function() {
    return gulp.src('src/scss/main.scss')
        .on('data', processWinPath)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/bower_components/foundation/scss/']
        }).on('error', function logError(error) {
            notify().write(error);
            this.emit('end');
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css/'));
});

gulp.task("build-css-no-source", function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({
            includePaths: ['src/bower_components/foundation/scss/'],
            outputStyle: 'compressed'
            }
        ).on('error', sass.logError))
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});

gulp.task('default', function() {
    browserSync({
        server: { baseDir: "./src/" },
        files: ['src/*.html', 'src/css/*.css', 'src/js/*.js']
    });
    //run fileinclude on html changes
    gulp.watch(['*.html', 'includes/*.html'], ['fileinclude']);
    //compile css on sass changes
    gulp.watch(['src/scss/*.scss'], ["build-css"]);
});


gulp.task('fileinclude', function() {
    gulp.src('*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./src'));
});

gulp.task('build', ['fileinclude','build-css-no-source', 'move-to-dist','clean']);

gulp.task('move-to-dist', ['build-css-no-source', 'fileinclude', 'fontsImages'], function() {
    return gulp.src('src/*.html')
        .pipe(usemin({
            css: [ rev ],
            /*html: [ function () {return minifyHtml({ empty: true });} ],*/
            js: [ uglify, rev ],
            jsmain: [],
            inlinejs: [ uglify ],
            inlinecss: [ minifyCss, 'concat' ]
        }))
        .pipe(gulp.dest('dist/'));
});
gulp.task('fontsImages', ['images'], function(){
    gulp.src('src/fonts/**')
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src('src/img/**')
        .pipe(gulp.dest('dist/img/'));
});


//run once after project has been created
gulp.task('init', function() {
    //move slick from bower components into project
    gulp.src('.src/bower_components/slick-carousel/slick/slick.scss')
        .pipe(gulp.dest('src/scss'));
    gulp.src('.src/bower_components/foundation/scss/foundation/_settings.scss')
        .pipe(gulp.dest('src/scss'));
});

gulp.task('make-iconfont', function() {
    gulp.src(['svg/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            fontPath: '../fonts/',
            targetPath: '../scss/_icons.scss'
        }))
        .pipe(iconfont({
            fontName: fontName,
            fontHeight: 500,
            prependUnicode: true,
            appendCodepoints: true,
            normalize: true
        }))
        .pipe(gulp.dest('src/fonts/'));

});

var generateIconImport = function(inputfile) {
    fs.readFile(inputfile, function(err, data) {
        if (err) throw err;
        var content = data.toString();
        var html = "<div class='row icon-testing'><div class='small-12 columns'>";
        var re = /(icon\-\w.*(?=:))/g;
        var matches = content.match(re);
        matches.forEach(function(item) {
            html += "<div class='icon " + item + "'> " + item + "</div>";
        });
        console.log(html);
        fs.writeFile('src/fonts/icons.html', html + '</div></div>', function(err) {});
    });

}

gulp.task('view-iconfont', function() {
    generateIconImport("src/scss/_icons.scss");
});
