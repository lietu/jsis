var fs = require('fs');

module.exports.testSyntax = function(test) {
    var files = [
        '../classes/JSIS.js',
        '../classes/LogData.js',
        '../classes/Logger.js',
        '../classes/LogRelayer.js',
        '../classes/Stats.js',
        '../classes/StatsAnalyzer.js',
        '../classes/StatsToHTML.js',
        '../classes/Utils.js',
        '../classes/LogReaders/eggdrop.js',
        '../classes/LogReaders/irssi.js',
    ];

    for (var i= 0, count=files.length; i<count; ++i) {
        var result = require(files[i]);
        test.ok(typeof result !== "undefined", files[i] + " has no syntax errors");
        result = null;
    }

    test.done();
};