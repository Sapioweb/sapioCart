var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('default', function() {
  gulp.src('lib/*.js')
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('dist'))
});
