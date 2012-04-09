
/**
 * Helper to relay data from a LogReader to a LogData instance
 * @param logData
 */
var LogRelayer = function(logData) {

	/**
	 * Write a new entry to log data
	 *
	 * @param {String} type One of: line, action, mode, join, part, kick, topic, nickHostmask
	 * @param {XDate} timestamp The timestamp on when this log entry occurred
	 * @param data
	 */
	var writeToLogData = function(type, timestamp, data) {

		// Pass data to appropriate functions in the LogData class
		switch( type ) {
			case 'line':
			case 'action':
				logData.addLine( timestamp, data.nick, data.text, (type==='action') );
				break;

			case 'mode':
				logData.addMode(timestamp, data.nick, data.mode);
				break;

			case 'join':
				logData.addJoin(timestamp, data.nick);
				break;

			case 'part':
				logData.addPart(timestamp, data.nick);
				break;

			case 'kick':
				logData.addPart(timestamp, data.target, data.nick, data.reason);
				break;

			case 'topic':
				logData.addTopic(timestamp, data.nick, data.topic);
				break;

			case 'nickHostmask':
				logData.registerNickHostmask(data.nick, data.hostmask);
				break;

			default:
				throw new Error('Unknown log entry type "' + type + '"');
		}

	};

	/**
	 * @type {Boolean} Are we buffering or not?
	 */
	var buffering = false;

	/**
	 * @type {Array} Buffered data
	 */
	var bufferData = [];

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

		// Loop through any buffered items
		for( var i=0, count=bufferData.length; i<count; ++i ) {
			var item = bufferData[i];

			// And write the items
			writeToLogData( item.type, item.timestamp, item.data );
		}

		// Clear the buffer
		bufferData = [];
	};

	/**
	 * Log an event from the logs
	 *
	 * @param {String} type One of: line, action, mode
	 * @param timestamp
	 * @param data
	 */
	this.log = function(type, timestamp, data) {

		// If we want to buffer this, push to the buffer
		if( buffering===true ) {

			bufferData.push( {type: type, timestamp: timestamp, data: data} );

		// All is fine, just process it
		} else {

			writeToLogData( type, timestamp, data );

		}
	};

};


module.exports = LogRelayer;
