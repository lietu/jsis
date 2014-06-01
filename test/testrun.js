var fs = require('fs');
var path = require('path');
var Logger = require('../classes/Logger.js');
var existsSync = fs.existsSync || path.existsSync;

var jsis = require('../classes/JSIS.js');

var oldLog = Logger.log;

module.exports.setUp = function(callback) {
    fs.writeFileSync('config.js', fs.readFileSync('test_files/test_config.js'));
    Logger.log = function() {};
    callback();
};

module.exports.tearDown = function(callback) {
    Logger.log = oldLog;
    callback();
};

module.exports.testRun = function(test) {
    test.expect(1);

    var completed = false;
    var to = null;
    var runComplete = function() {
        if (to) {
            clearTimeout(to);
        }

        test.ok(existsSync('test_files/destination/index.html'));
        completed = true;
        test.done();
    };

    jsis.start(runComplete);

    to = setTimeout(function() {
        throw new Error("Test failed to complete within a reasonable amount of time");
    }, 10000);

};
