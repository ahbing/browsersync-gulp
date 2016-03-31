var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

var paths = {
  scripts: ['**/*.js', '!node_modules/**/*.js', '!public/**/*.js', '!src/**/*.js']
};

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(paths.scripts)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

// js任务 
gulp.task('js', function () {
    return gulp.src('src/js/*js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

// 压缩css 输出到dist目录
gulp.task('css', function () {
    gulp.src('dist/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
})
// 图片压缩  输出到 dist 目录
gulp.task('images', function () {
    gulp.src('src/images/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
});

//  编译sass 遇到错误 及时将 错误信息返回
gulp.task('sass', function() {
    return sass('src/sass/*.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('dist/css'))
});

// 拷贝字体文件到dist目录
gulp.task('copyfonts', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
});

// jade编译成 html
gulp.task('jade', function() {
  gulp.src('jade/**/*.jade')
    .pipe(jade())
    // jade 任务默认会将 html文件压缩 如果不需要压缩 可以去掉下面这行注释
    //.pipe(jade({ pretty: true }))
    .pipe(gulp.dest('views/'))
});

// 监听源文件改动   并执行相应的任务
gulp.task('auto',function(){
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/js/*js', ['js']);
  gulp.watch('dist/css/*.css', ['css']);
  gulp.watch('src/images/*.*', ['images']);
  gulp.watch('src/fonts/*.*', ['copyfonts']);
  gulp.watch('jade/**/*.jade',['jade']);
})

// browsersync 服务，同步浏览器刷新
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    // 监听各类文件输出文件改动 刷新浏览器
    gulp.watch("dist/js/*.js").on('change', browserSync.reload);
    gulp.watch("dist/css/*.css").on('change', browserSync.reload);
    gulp.watch("dist/images/*.*").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);

});

gulp.task('dist', ['sass', 'copyfonts', 'images']);

gulp.task('lint', ['jshint', 'jscs']);

// 开启gulp任务 
gulp.task('default', ['lint', 'dist','serve', 'auto']);