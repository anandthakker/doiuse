gulp = require('gulp')

coffee = require('gulp-coffee')

paths=
  coffee: 'src/**/*.coffee'

gulp.task 'coffee', [], ->
  gulp.src(paths.coffee)
  .pipe coffee(bare:true)
  .pipe gulp.dest('.')

gulp.task 'watch', ['coffee'], ->
  gulp.watch paths.coffee, ['coffee']
