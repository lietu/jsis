var fs = require('fs');
var WeechatLogReader = require('../classes/LogReaders/weechat.js');
var LogRelayer = require('./mock_logrelayer.js');

var config = {
    logTimezone: '+00:00'
};

module.exports.testWeechatReader = function (test) {
    test.expect(2);

    var expected = require('../test_files/weechat_expected.json');

    var relay = new LogRelayer();
    var reader = new WeechatLogReader(relay, config);
    reader.parse(fs.readFileSync('test_files/weechat/test-2000-01-01.log'));

    test.deepEqual(relay.getEntries(), expected);
    test.equal(relay.buffering, false);

    test.done();
};
