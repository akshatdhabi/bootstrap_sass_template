/*jshint esversion: 6 */
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');

//Image min task
gulp.task('imagemin', function() {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

// Compile sass
gulp.task('sass', function() {
  return gulp.src(['src/scss/*.scss'])
    //Throw error
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browsersync.stream());
});

gulp.task('autoprefixer', function() {
  gulp.src('src/css/style.css')
    .pipe(autoprefixer({
      browsers: ['since 2010']
    }))
    .pipe(gulp.dest('dist/css'));
});

//Minify and concat javascript
gulp.task('concat', function() {
  gulp.src('src/scripts/*.js')
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});
//copy HTML to dist folder
gulp.task('copyHtml', function() {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

//Serve
gulp.task('serve', ['sass'], function() {
  browsersync.init({
    server: './dist'
  });
  gulp.watch('src/scripts/*.js', ['concat']);
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/css/*.css', ['autoprefixer']);
  gulp.watch('src/images/*', ['imagemin']);
  gulp.watch('src/*.html', ['copyHtml']);
  gulp.watch(['dist/*.html']).on('change', browsersync.reload);
  gulp.watch(['dist/images/*']).on('change', browsersync.reload);
  gulp.watch(['dist/js/*.js']).on('change', browsersync.reload);
  gulp.watch(['dist/css/*.css']).on('change', browsersync.reload);

});

//Default tast for gulp
gulp.task('default', ['sass', 'autoprefixer', 'imagemin', 'concat', 'copyHtml', 'serve']);