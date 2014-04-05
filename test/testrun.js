var fs = require('fs');
var path = require('path');

var existsSync = fs.existsSync || path.existsSync;

var jsis = require('../classes/JSIS.js');

module.exports.setUp = function(callback) {
    fs.writeFileSync('config.js', fs.readFileSync('test_files/test_config.js'));
    callback();
};

module.exports.testSyntax = function(test) {
    jsis.start();
    test.ok(existsSync('test_files/destination/index.html'));
    test.done();
};