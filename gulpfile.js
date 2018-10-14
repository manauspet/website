const browserSync = require('browser-sync');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const pump = require('pump');

const $ = gulpLoadPlugins();

function clean(cb) {
  return pump([
    gulp.src('./dist', { allowEmpty: true }),
    $.clean(),
  ], cb);
}

function img(cb) {
  return pump([
    gulp.src('./src/img/*'),
    gulp.dest('./dist/img'),
  ], cb);
}

function html(cb) {
  return pump([
    gulp.src('./src/index.html'),
    $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
    }),
    gulp.dest('./dist')
  ], cb);
}

function serve() {
  browserSync.init({
    server: './dist'
  });

  gulp.watch('./src/*.html').on('change', html);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
}

const build = gulp.series([
  clean,
  gulp.parallel([ img, html ]),
]);

gulp.task('build', build);
gulp.task('serve', gulp.series([ build, serve ]));
