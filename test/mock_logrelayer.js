/**
 * Super simplified mock of LogRelayer for unit testing
 */
var LogRelayerMock = function() {

	/**
	 * @type {Boolean} Are we buffering or not?
	 */
	var buffering = false;

	/**
	 * @type {Array} Buffered data
	 */
	var bufferData = [];

	// Counters for parsed content
	this.fileCount = 0;
	this.byteCount = 0;

    /**
     * List of log entries provided by log reader
     * @type {Array}
     */
    this.entries = [];

	/**
	 * Enable buffering, items will be stored in a temporary buffer instead of passing to LogData until buffer is disabled
	 */
	this.enableBuffering = function() {
		buffering = true;
	};

	/**
	 * Disable buffering, and process all the items in the buffer
	 */
	this.disableBuffering = function() {

		// No more buffering, thanks
		buffering = false;
	};

	/**
	 * Log an event from the logs
	 *
	 * @param {String} type One of: line, action, mode
	 * @param timestamp
	 * @param data
	 */
	this.log = function(type, timestamp, data) {
        this.entries.push({
            type: type,
            timestamp: timestamp.toISOString(),
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

};


module.exports = LogRelayerMock;
