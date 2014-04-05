var glob = require('glob');
var fs = require('fs');

module.exports.setUp = function(callback) {
    fs.writeFileSync('config.js', fs.readFileSync('test_files/test_config.js'));
    callback();
};

module.exports.testSyntax = function(test) {
    var files = []
    files = files.concat(glob.sync('classes/**/*.js'));
    files = files.concat(glob.sync('lib/**/*.js'));
    files = files.concat(glob.sync('widgets/**/*.js'));

    for (var i= 0, count=files.length; i<count; ++i) {
        var result = require('../' + files[i]);
        test.ok(typeof result !== "undefined", files[i] + " has no syntax errors");
        result = null;
    }

    test.done();
};