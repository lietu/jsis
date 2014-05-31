var Utils = require('../classes/Utils.js');

module.exports.testRound = function(test) {
    test.expect(3);

    test.equal(Utils.round(1.234), "1.23");
    test.equal(Utils.round(1.23456789, 4), "1.2346");
    test.equal(Utils.round(1), "1");

    test.done();
};

module.exports.testByteText = function(test) {
    test.expect(3);

    test.equal(Utils.byteText(7), "7 B");
    test.equal(Utils.byteText(1.23 * 1024), "1.23 kiB");
    test.equal(Utils.byteText(999 * 1024 * 1024 * 1024), "999 GiB");

    test.done();
};
