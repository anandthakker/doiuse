
var cp_exec = require('child_process').exec,
    path = require('path');
var should = require('chai').should();

var cssFile = path.join(__dirname,'/cases/gradient.css');
var expected = "<input css 1>:2:5: CSS Gradients not supported by: IE (8,9)\n\
<input css 2>:2:5: CSS Gradients not supported by: IE (8,9)\n\
<input css 3>:2:5: CSS Repeating Gradients not supported by: IE (8,9)\n\
<input css 4>:2:5: CSS Repeating Gradients not supported by: IE (8,9)\n";

var commands = {
  cat: ' cat ' + cssFile + ' | tee /dev/tty ',
  doiuse: ' node ' + path.join(__dirname, '../cli.js') + ' --browsers="IE >= 8" '
}

var exec = function(cmd, cb) {
  console.log(cmd);
  cp_exec(cmd, cb);
} 

describe('cli command', function() {
  it('should take piped input', function (done) {
    exec(commands.cat + ' | ' + commands.doiuse,function(error, stdout, stderr) {
      stdout.should.be.equal(expected);
      done()
    });
  })
  
  it('should take filename as input', function (done) {
    exec(commands.doiuse + cssFile,function(error, stdout, stderr) {
      stdout.should.be.equal(expected)
      done()
    });
  })
  
  it('--json option should work', function (done) {
    exec(commands.doiuse + '--json ' + cssFile,function(error, stdout, stderr) {
      var result = stdout.trim()
      .split(/\r?\n/)
      .map(JSON.parse.bind(JSON))
      .map(function(usage) { return usage.feature; });
      result.should.be.deep.equal([
        'css-gradients',
        'css-gradients',
        'css-repeating-gradients',
        'css-repeating-gradients' ])
        
      done()
    });
  })
  
  it('--list-only should work', function (done) {
    exec(commands.doiuse + '--list-only',function(error, stdout, stderr) {
      stdout.trim().should.be.equal('[doiuse] Browsers: IE 8, IE 9, IE 10, IE 11');
      done()
    });
  })
  
})
