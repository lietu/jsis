var fs = require('fs');
var jsis = require('../classes/JSIS.js');

module.exports.setUp = function(callback) {
    fs.writeFileSync('config.js', fs.readFileSync('test_files/test_config.js'));
    callback();
};

module.exports.testSyntax = function(test) {
    jsis.start();
    test.ok(fs.existsSync('test_files/destination/index.html'));
    test.done();
};