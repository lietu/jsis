var Utils = require('../../classes/Utils.js');
var XDate = require('../../lib/xdate.dev.js');
var Logger = require('../../classes/Logger.js');

/**
 * Parse weechat log string into the logRelayer object
 * @param {LogRelayer} logRelayer
 */
var SupybotReader = function (logRelayer, channelConfig) {

    /**
     * @type {LogRelayer}
     */
    this.logRelayer = logRelayer;

    /**
     * Read a single line
     */
    this.readLine = function () {

        // If we no-longer have a log string, fail
        if (typeof this.logString !== 'string') {
            return false;
        }

        /**
         * Resulting line
         * @type {String}
         */
        var result;

        // Try and find a linefeed
        var nextPos = this.logString.indexOf("\n");

        // If the string has a linefeed somewhere
        if (nextPos !== -1) {

            // Get the contents until that feed
            result = this.logString.substr(0, nextPos);

            // And remove it from the start of the source
            this.logString = this.logString.substr(nextPos + 1);

            // If not, we must be at the last line, or past it
        } else {

            result = this.logString;
            this.logString = null;
        }

        return result;
    };

    // Regular expression string to match (and select) the timestamp on the line
    var timeRegExpString = '([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2})';

    var lineRegExp = new RegExp('^' + timeRegExpString + '\\s+([^\\s]+)\\s+(.*)$');
    var modeRegExp = new RegExp('^' + timeRegExpString + '\\s+--\\s+Mode ([^ ]+) \\[([^\\]]+)\\] by (.+)$');
    var joinPartRegExp = new RegExp('^' + timeRegExpString + '\\s+(<--|-->)\\s+([^ ]+) \\(([^)]+)\\) has (joined|left) ');
    var nickChangeRegExp = new RegExp('^' + timeRegExpString + '\\s+--\\s+([^ ]+) is now known as (.+)$');
    var quitRegExp = new RegExp('^' + timeRegExpString + '\\s+<--\\s+([^ ]+) \\(([^)]+)\\) has quit ');
    var actionRegExp = new RegExp('^' + timeRegExpString + '\\s+\\*\\s+([^ ]+) (.*)$');
    var topicRegExp = new RegExp('^' + timeRegExpString + '\\s+--\\s+([^ ]+) has changed topic for ([^ ]+) from \"(.*)\" to "(.*)"$')
    var kickRegExp = new RegExp('^' + timeRegExpString + '\\s+<--\\s+([^ ]+) has kicked ([^ ]+) \\(([^)]+)\\)$')

    this.tzData = channelConfig.logTimezone;

    /**
     * Parse a log buffer's contents, save data into our LogData object
     * @param logBuffer {Buffer}
     */
    this.parse = function (logBuffer) {

        // We were given a buffer, buffers are dull, and difficult to work with, so let's just take a string representation of it
        var logString = logBuffer.toString();

        // Log a new file being parsed
        this.logRelayer.logFile(logString.length);

        // Trim the string, extra linefeeds and such, then save it for use in readLine()
        this.logString = Utils.trim(logString);

        /**
         * Build the timestamp for a line from the time string, e.g. "14:56"
         */
        var lineTimestamp = function (timestamp) {
            var date = new XDate(timestamp + this.tzData);

            return date;
        }.bind(this);

        // Read all lines, line by line
        var line, data, timestamp;
        var lineNumber = 0;

        while (line = this.readLine()) {

            lineNumber++;

            if (data = line.match(modeRegExp)) {

                // Log this mode change
                this.logRelayer.log('mode', lineTimestamp(data[1]), {nick: data[4], mode: data[3]});

            } else if (data = line.match(actionRegExp)) {

                // Log this mode change
                this.logRelayer.log('action', lineTimestamp(data[1]), {nick: data[2], text: data[3]});

            } else if (data = line.match(topicRegExp)) {

				// Log this topic change
				this.logRelayer.log('topic', lineTimestamp(data[1]), {nick: data[2], topic: data[5]});


            } else if (data = line.match(kickRegExp)) {

                // Log this mode change
                this.logRelayer.log('kick', lineTimestamp(data[1]), {target: data[3], nick: data[2], reason: data[4]});


            } else if (data = line.match(joinPartRegExp)) {

                timestamp = lineTimestamp(data[1]);

                // This is one of those lines that reveal the nicks' full hostmask, let's make sure we save that data
                this.logRelayer.log('nickHostmask', timestamp, {nick: data[3], hostmask: data[4]});

                // Register a join or part depending on which this is
                if (data[5] === 'joined') {
                    this.logRelayer.log('join', timestamp, {nick: data[3]});
                } else {
                    this.logRelayer.log('part', timestamp, {nick: data[3]});
                }

            } else if (data = line.match(quitRegExp)) {

                timestamp = lineTimestamp(data[1]);

                // This is one of those lines that reveal the nicks' full hostmask, let's make sure we save that data
                this.logRelayer.log('nickHostmask', timestamp, {nick: data[2], hostmask: data[3]});

                // Register a part
                this.logRelayer.log('part', timestamp, {nick: data[2]});

            } else if (data = line.match(nickChangeRegExp)) {

                // Log this topic change
                this.logRelayer.log('nickChange', lineTimestamp(data[1]), {fromNick: data[2], toNick: data[3]});

            } else if (data = line.match(lineRegExp)) {

                // Log this line
                this.logRelayer.log('line', lineTimestamp(data[1]), {nick: data[2], text: data[3]});

            } else {

                // Unrecognized line, e.g. netsplit, return from netsplit, etc.
                // We're missing quite a lot of line types from our example for now
                Logger.log('WARN', 'Unrecognized line: ' + line);


            }
        }
    }

};

// All we want to export is our little class
module.exports = SupybotReader;
