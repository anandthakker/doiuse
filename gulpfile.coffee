gulp = require('gulp')
gutil = require('gulp-util')
coffee = require('gulp-coffee')

paths=
  coffee: 'src/**/*.coffee'

buildCoffee = (failOnErrors=true) -> ->
  coffeeStream = coffee(bare:true)
  coffeeStream.on('error', (args...)->
    gutil.log(args...)
    this.emit 'end')  unless failOnErrors
  gulp.src(paths.coffee)
  .pipe coffeeStream
  .pipe gulp.dest('dist')

gulp.task 'coffee:dev', [], buildCoffee(false)
gulp.task 'coffee:build', [], buildCoffee(true)

gulp.task 'watch', ['coffee:dev'], ->
  gulp.watch paths.coffee, ['coffee:dev']

gulp.task 'build', ['coffee:build'], ->
