var cp_exec = require('child_process').exec
var path = require('path')

var test = require('tape')

var cssFile = path.join(__dirname, '/cases/gradient.css')
var pathToCli = ' node ' + path.join(__dirname, '../cli.js')
var catCss = ' cat ' + cssFile + ' | tee /dev/tty '

var expected_css_gradients = '<streaming css input>:8:1: CSS Gradients not supported by: IE (8,9) (css-gradients)\n' +
  '<streaming css input>:12:1: CSS Gradients not supported by: IE (8,9) (css-gradients)\n'
var expected_css_repeating_gradients = '<streaming css input>:16:1: CSS Repeating Gradients not supported by: IE (8,9) (css-repeating-gradients)\n' +
  '<streaming css input>:20:1: CSS Repeating Gradients not supported by: IE (8,9) (css-repeating-gradients)\n'
var expected = expected_css_gradients + expected_css_repeating_gradients
var commands = {
  cat: catCss,
  doiuse: pathToCli + ' --browsers="IE >= 8" '
}

var expected_with_ignore = expected_css_repeating_gradients
var commands_with_ignore = {
  cat: catCss,
  doiuse: pathToCli + ' --browsers="IE >= 8" --ignore="css-gradients" '
}

var exec = function (cmd, cb) {
  console.log(cmd)
  cp_exec(cmd, cb)
}

test('cli command: piped input', function (t) {
  exec(commands.cat + ' | ' + commands.doiuse, function (error, stdout, stderr) {
    t.equal(stdout, expected)
    t.end(error)
  })
})

test('should take filename as input', function (t) {
  exec(commands.doiuse + cssFile, function (error, stdout, stderr) {
    t.equal(stdout, expected.replace(/<streaming css input>/g, cssFile))
    t.end(error)
  })
})

test('cli command with ignore: piped input', function (t) {
  exec(commands_with_ignore.cat + ' | ' + commands_with_ignore.doiuse, function (error, stdout, stderr) {
    t.equal(stdout, expected_with_ignore)
    t.end(error)
  })
})

test('should take filename as input with ignore', function (t) {
  exec(commands_with_ignore.doiuse + cssFile, function (error, stdout, stderr) {
    t.equal(stdout, expected_with_ignore.replace(/<streaming css input>/g, cssFile))
    t.end(error)
  })
})

test('--json option should work', function (t) {
  exec(commands.doiuse + '--json ' + cssFile, function (error, stdout, stderr) {
    var result = stdout.trim()
      .split(/\r?\n/)
      .map(JSON.parse.bind(JSON))
      .map(function (usage) { return usage.feature })
    t.deepEqual(result, [
      'css-gradients',
      'css-gradients',
      'css-repeating-gradients',
      'css-repeating-gradients' ])

    t.end(error)
  })
})

test('--list-only should work', function (t) {
  exec(commands.doiuse + '--list-only', function (error, stdout, stderr) {
    t.equal(stdout.trim(), '[doiuse] Browsers: IE 8, IE 9, IE 10, IE 11')
    t.end(error)
  })
})
