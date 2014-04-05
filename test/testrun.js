var fs = require('fs');
var path = require('path');
var existsSync = fs.existsSync || path.existsSync;

var jsis = require('../classes/JSIS.js');

module.exports.setUp = function(callback) {
    fs.writeFileSync('config.js', fs.readFileSync('test_files/test_config.js'));
    callback();
};

module.exports.testRun = function(test) {
    test.expect(2);

    var completed = false;
    var runComplete = function() {
        test.ok(existsSync('test_files/destination/index.html'));
        completed = true;
    };

    jsis.start(runComplete);

    setTimeout(function() {
        test.ok(completed, 'Run completed in under 5s');
        test.done();
    }, 5000);

};