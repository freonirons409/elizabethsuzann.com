var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var notify = require('gulp-notify');
var prefix = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var fontName = 'Icons';
var spritesmith = require('gulp.spritesmith');
var fs = require('fs');
var fileinclude = require('gulp-file-include');
// var sourcemaps = require('gulp-sourcemaps');

// var newer = require('gulp-newer');
// var imagemin = require('gulp-imagemin');

//needed because current gulp-sass errors with source maps on windows
var processWinPath = function(file) {
    var path = require('path');
    if (process.platform === 'win32') {
        file.path = path.relative('.', file.path);
        file.path = file.path.replace(/\\/g, '/');
    }
};

gulp.task("build-css", function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({
            errLogToConsole: false,
            sourceMap: 'sass',
            sourceComments: 'map',
            includePaths: ['src/bower_components/foundation/scss/'],
            onError: function callback(err){
               return notify().write(err);
            }
        }))
        .pipe(gulp.dest('src/css/'));
});

gulp.task("build-css-no-source", function() {
    return gulp.src('src/scss/main.scss')
        .on('data', processWinPath)
        .pipe(sass({
            errLogToConsole: false,
            includePaths: ['src/bower_components/foundation/scss/', 'src/bower_components/compass-mixins/lib/', 'slick/'],
            onError: function(err) {
                return notify().write(err);
            }
        }))
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});


gulp.task('default', function() {
     browserSync({
        server: {
            baseDir: "./src/"
        }
    });

    //reload on html or js change
    
    gulp.watch(['*.html', 'includes/*.html'], ['fileinclude']);

    gulp.watch(['src/scss/*.scss'], ["build-css"]);
    gulp.watch(['src/css/*.css', 'src/js/*.js'], browserSync.reload);

    //need to figure out cert issue
    //gulp.watch(["img/*.jpg", "img/*.png", "img/*.gif", "img/*.jpeg"], ["compress-images"]);
});


gulp.task('fileinclude', function() {
  gulp.src('*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(browserSync.reload({stream:true}));
});

// gulp.task('compress-images', function() {
//     var imgSrc = ["img/*.jpg", "img/*.png", "img/*.gif", "img/*.jpeg"],
//         imgDest = 'img/comp';

//     // Add the newer pipe to pass through newer images only
//     return gulp.src(imgSrc)
//         .pipe(newer(imgDest))
//         .pipe(imagemin({
//             optimizationLevel: 4
//         }))
//         .pipe(gulp.dest(imgDest));
// });

gulp.task('build', ['build-css-no-source', 'move-to-dist', 'minify-css']);

gulp.task('unlock-dist',function(){
 return gulp.src(['dist/index.html'])
        .pipe(gulpTfs({ command: 'edit', params: { lock: 'none' } }))
        .pipe(gulp.dest('./'));
});

gulp.task('move-to-dist', ['build-css-no-source'], function() {
    

    var stream = gulp.src('src/*.html')
        .pipe(usemin({
          //  assetsDir:"./src/",
            css: ['concat'],
            js: [uglify()]
        }))
        .pipe(gulp.dest('dist/'));

    gulp.src('./src/fonts/**')
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src('./src/img/**')
        .pipe(gulp.dest('dist/img/'));
    gulp.src('./src/js/main.js')
        .pipe(gulp.dest('dist/js/'));

    return stream;

});

gulp.task('minify-css', ['move-to-dist'], function() {
    return gulp.src('./dist/css/styles.css')
        .pipe(minifyCSS())
        .pipe(rename("dist/css/styles-min.css"))
        .pipe(gulp.dest('./'));
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
            fontHeight:1000,
            appendCodepoints: true,
            normalize:true
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

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    imgPath: '..src/img/sprite.png',
    algorithm: 'alt-diagonal',
    cssOpts: {
      cssClass: function (item) {
        // `item` has `x`, `y`, `width`, `height`, `name`, `image`, and more
        // It is suggested to `console.log` output
        return '.sprite-before-' + item.name + ':before, .sprite-after-' + item.name + ':after';
      }
  }
  }));
  spriteData.img.pipe(gulp.dest('src/img/'));
  spriteData.css.pipe(gulp.dest('src/css/'));
});
