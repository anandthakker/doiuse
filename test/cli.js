var cp_exec = require('child_process').exec,
  path = require('path')

var test = require('tape')

var cssFile = path.join(__dirname, '/cases/gradient.css')
var expected = '<streaming css input>:8:1: CSS Gradients not supported by: IE (8,9)\n' +
  '<streaming css input>:12:1: CSS Gradients not supported by: IE (8,9)\n' +
  '<streaming css input>:16:1: CSS Repeating Gradients not supported by: IE (8,9)\n' +
  '<streaming css input>:20:1: CSS Repeating Gradients not supported by: IE (8,9)\n'

var commands = {
  cat: ' cat ' + cssFile + ' | tee /dev/tty ',
  doiuse: ' node ' + path.join(__dirname, '../cli.js') + ' --browsers="IE >= 8" '
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
