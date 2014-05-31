var fs = require('fs');
var EggdropLogReader = require('../classes/LogReaders/eggdrop.js');
var LogRelayer = require('./mock_logrelayer.js');

var config = {
    logTimezone: '+00:00'
};

module.exports.testEggdropReader = function (test) {
    test.expect(2);

    var expected = require('../test_files/eggdrop_expected.json');

    var relay = new LogRelayer();
    var reader = new EggdropLogReader(relay, config);
    reader.parse(fs.readFileSync('test_files/eggdrop/1/test.log.2009-07-07'));

    test.deepEqual(relay.getEntries(), expected);
    test.equal(relay.buffering, false);

    test.done();
};
