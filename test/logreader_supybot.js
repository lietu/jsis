var fs = require('fs');
var SupybotLogReader = require('../classes/LogReaders/supybot.js');
var LogRelayer = require('./mock_logrelayer.js');

var config = {
    logTimezone: '+00:00'
};

module.exports.testSupybotReader = function (test) {
    test.expect(2);

    var expected = require('../test_files/supybot_expected.json');

    var relay = new LogRelayer();
    var reader = new SupybotLogReader(relay, config);
    reader.parse(fs.readFileSync('test_files/supybot/test-2000-01-01.log'));

    test.deepEqual(relay.getEntries(), expected);
    test.equal(relay.buffering, false);

    test.done();
};
