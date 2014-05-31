/**
 * Super simplified mock of LogRelayer for unit testing
 */
var LogRelayerMock = function() {

	/**
	 * @type {Boolean} Are we buffering or not?
	 */
	this.buffering = false;

	// Counters for parsed content
	this.fileCount = 0;
	this.byteCount = 0;

    /**
     * List of log entries provided by log reader
     * @type {Array}
     */
    var entries = [];

	/**
	 * Enable buffering, items will be stored in a temporary buffer instead of passing to LogData until buffer is disabled
	 */
	this.enableBuffering = function() {
		this.buffering = true;
	};

	/**
	 * Disable buffering, and process all the items in the buffer
	 */
	this.disableBuffering = function() {

		// No more buffering, thanks
		this.buffering = false;
	};

	/**
	 * Log an event from the logs
	 *
	 * @param {String} type One of: line, action, mode
	 * @param timestamp
	 * @param data
	 */
	this.log = function(type, timestamp, data) {
        entries.push({
            type: type,
            timestamp: timestamp,
            data: data
        })
	};

	/**
	 * Log a new file being parsed
	 * @param bytes Number of bytes in the file
	 */
	this.logFile = function(bytes) {
		++this.fileCount;
		this.byteCount += bytes;
	}

    /**
     * Extract the entries in a format suitable for tests.
     */
    this.getEntries = function() {
        var result = [];
        for (var i = 0, count = entries.length; i < count; ++i) {
            result.push({
                type: entries[i].type,
                timestamp: entries[i].timestamp.toISOString(),
                data: entries[i].data
            });
        }

        return result;
    };

};


module.exports = LogRelayerMock;
