var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var notify = require('gulp-notify');
var prefix = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var iconfont = require('gulp-iconfont');
var sourcemaps = require('gulp-sourcemaps');
var iconfontCss = require('gulp-iconfont-css');
var fontName = 'Icons';
var minifyHtml = require('gulp-htmlnano');
var minifyCss = require('gulp-cssnano');
// var spritesmith = require('gulp.spritesmith');
var fs = require('fs');
var fileinclude = require('gulp-file-include');
var path = require('path');
var rev = require('gulp-rev');
var del = del = require('del');
var preprocess = require('gulp-preprocess');
var cache = require('gulp-cache');
var reload  = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
// var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
//var sitemap = require('gulp-sitemap');

//needed becaues current gulp-sass errors with source maps on windows
var processWinPath = function(file) {
    
    if (process.platform === 'win32') {
        file.path = path.relative('.', file.path);
        file.path = file.path.replace(/\\/g, '/');
    }
};
/* ====================================================== */
gulp.task("name", function() {
    console.log(path.basename(__dirname));
});
/* ====================================================== */
gulp.task('default', function() {
    preprocess({ context: { NODE_ENV: 'development', DEBUG: false }})
    browserSync({
        server: { baseDir: "./src/" },
        files: ['src/*.html', 'src/css/*.css', 'src/js/*.js']
    });
    //run fileinclude on html changes
    gulp.watch(['*.html', 'includes/*.html'], ['fileinclude']);
    //compile css on sass changes
    gulp.watch(['src/scss/*.scss'], ["build-css","build-font-css"]);
    gulp.watch(['src/scss/snips/local.scss'], ["build-css","build-font-css"]);
});
/* ====================================================== */
//clean out that mothafuckin' dist folder
gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img']);
});
/* ====================================================== */
// Image compression
gulp.task('images',['clean'], function() {
  return gulp.src('src/img/*')
    //.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});
/* ====================================================== */
//build bower/foundation scss files
gulp.task("build-css", function() {
    return gulp.src('src/scss/main.scss')
        .on('data', processWinPath)
        .pipe(preprocess({ context: { NODE_ENV: 'development', DEBUG: false }}))
        // .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/bower_components/foundation/scss/']
        }).on('error', function logError(error) {
            notify().write(error);
            this.emit('end');
        }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css/'));
});
gulp.task("build-css-prod", function() {
    return gulp.src('src/scss/main.scss')
        .pipe(preprocess({ context: { NODE_ENV: 'production', DEBUG: false }}))
        .on('data', processWinPath)
        // .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/bower_components/foundation/scss/']
        }).on('error', function logError(error) {
            notify().write(error);
            this.emit('end');
        }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css/'));
});
/* ====================================================== */
gulp.task("build-font-css", function() {
    return gulp.src(['src/scss/snips/local.scss','src/scss/icons.scss'])
        .pipe(preprocess({ context: { NODE_ENV: 'development', DEBUG: false }}))
        .pipe(concat('icons.css'))
        .on('data', processWinPath)
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function logError(error) {
            console.log(error);
            this.emit('end');
        })
        //.pipe(sourcemaps.write())
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});
gulp.task("build-font-css-prod", function() {
    return gulp.src(['src/scss/snips/shopify.scss','src/scss/icons.scss'])
        .pipe(preprocess({ context: { NODE_ENV: 'production', DEBUG: false }}))
        .pipe(concat('icons.css'))
        .on('data', processWinPath)
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function logError(error) {
            console.log(error);
            this.emit('end');
        })
        //.pipe(sourcemaps.write())
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});
/* ====================================================== */
gulp.task("build-css-no-source", function() {
    return gulp.src('src/scss/main.scss')
        .pipe(preprocess({ context: { NODE_ENV: 'development', DEBUG: false }}))
        .pipe(sass({
            includePaths: ['src/bower_components/foundation/scss/'],
            outputStyle: 'compressed'
            }
        ).on('error', sass.logError))
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});

/* ====================================================== */
gulp.task('fileinclude', function() {
    gulp.src('*.html')
        .pipe(preprocess({ context: { NODE_ENV: 'development', DEBUG: true }}))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./src'));
});

gulp.task('fileinclude-prod', function() {
    gulp.src('*.html')
        .pipe(preprocess({ context: { NODE_ENV: 'production', DEBUG: false }}))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./src'));
});
/* ====================================================== */
gulp.task('build', ['clean','actualBuild']);
gulp.task('actualBuild', ['fileinclude-prod','build-css-prod','build-font-css-prod','move-to-dist']);

/* ====================================================== */
gulp.task('move-to-dist', ['fontsImages'], function() {
    return gulp.src('src/*.html')
        .pipe(preprocess({ context: { NODE_ENV: 'production', DEBUG: false }}))
        .pipe(usemin({
            css: [minifyCss],
            //css: [], /* for use when compiling shopify fonts file */
            // css: [ rev ],
            /*html: [ function () {return minifyHtml({ empty: true });} ],*/
            js: [ uglify ],
            jsmain: [ ],
            inlinejs: [ uglify ],
            inlinecss: [ minifyCss(), 'concat' ]
        }))
        .pipe(gulp.dest('dist/'));
});
/* ====================================================== */
gulp.task('fontsImages', ['images'], function(){
    gulp.src('src/fonts/**')
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src('src/img/**')
        .pipe(gulp.dest('dist/img/'));
});
/* ====================================================== */
//run once after project has been created
gulp.task('init', function() {
    //move slick from bower components into project
    gulp.src('.src/bower_components/slick-carousel/slick/slick.scss')
        .pipe(gulp.dest('src/scss'));
    gulp.src('.src/bower_components/foundation/scss/foundation/_settings.scss')
        .pipe(gulp.dest('src/scss'));
});
/* ====================================================== */
gulp.task('icons', ['clean','make-iconfont','view-iconfont','build-font-css']);

gulp.task('make-iconfont', function() {
    gulp.src(['svg/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            fontPath: '../fonts/',
            targetPath: '../scss/icons.scss'
        }))
        .pipe(iconfont({
            fontName: fontName,
            fontHeight: 1000,
            appendCodepoints: true,
            normalize: true
        }))
        .pipe(gulp.dest('src/fonts/'));
});

gulp.task('view-iconfont', function() {
    generateIconImport("src/scss/icons.scss");
});
/* ====================================================== */
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
        //console.log(html);
        fs.writeFile('src/fonts/icons.html', html + '</div></div>', function(err) {});
    });

}
/* ====================================================== */
 
gulp.task( 'deploy', function () {
 
    var conn = ftp.create( {
        host:     'aaronirons.com',
        user:     'aaroniro',
        password: '@PX1094z',
        parallel: 3,
        log:      gutil.log
    } );
    // var globs = [
    //     'dist/img/**',
    //     'dist/css/**',
    //     'dist/js/**',
    //     'dist/php/**',
    //     'dist/fonts/**',
    //     'dist/*.php',
    //     'dist/*.html'
    // ];
    // using base = '.' will transfer everything to /public_html correctly 
    // turn off buffering in gulp.src for best performance 
 
    return gulp.src('dist/**', { base: 'dist/', buffer: false } )
        .pipe( conn.newer( '/public_html/aaronirons_net/staging/elizabethsuzann.com/' ) ) // only upload newer files 
        .pipe( conn.dest( '/public_html/aaronirons_net/staging/elizabethsuzann.com/' ) );
 
} );
