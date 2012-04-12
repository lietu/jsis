var Utils = require('../../classes/Utils.js');
var XDate = require('../../lib/xdate.dev.js');
var Logger = require('../../classes/Logger.js');

/**
 * Parse eggdrop log string into the logRelayer object
 * @param {LogRelayer} logRelayer
 */
var EggdropReader = function(logRelayer, channelConfig) {

	/**
	 * @type {LogRelayer}
	 */
	this.logRelayer = logRelayer;

	/**
	 * Read a single line
	 */
	this.readLine = function() {

		// If we no-longer have a log string, fail
		if( typeof this.logString!=='string' ) {
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
		if( nextPos!==-1 ) {

			// Get the contents until that feed
			result = this.logString.substr(0, nextPos);

			// And remove it from the start of the source
			this.logString = this.logString.substr(nextPos+1);

		// If not, we must be at the last line, or past it
		} else {

			result = this.logString;
			this.logString = null;
		}

		// Logger.log('DEBUG', 'Read line ' + JSON.stringify(result) );

		return result;
	};

	// Regular expression string to match (and select) the timestamp on the line
	var timeRegExpString = '\\[([0-9]{2}:[0-9]{2})(:[0-9]{2})?\\]';

	// .. and the nickname
	var nicknameRegExpString = '\<([^>]+)\>';

	// RegExp to match a line that reports a new date and select the date
	var dateRegExpString = '([a-z]{3} +[a-z]{3} +[0-9]{1,2} +[0-9]{4})';
	var dateRegExp = new RegExp('^' + timeRegExpString + ' --- ' + dateRegExpString + '$', 'i');

	// RegExp to match a normal line and an action
	var lineRegExp = new RegExp('^' + timeRegExpString + ' ' + nicknameRegExpString + ' (.*)');
	var actionRegExp = new RegExp('^' + timeRegExpString + ' Action: ([^ ]+) (.*)$');

	// RegExp to match a mode change
	var modeRegExp = new RegExp('^' + timeRegExpString + ' [^:]+: mode change \'([^\']+)\' by ([^!]+)!(.*)$');

	// RegExp to match a join or part
	var joinPartRegExp = new RegExp('^' + timeRegExpString + ' ([^ ]+) \\(([^)]+)\\) (joined|left) ');

	// RegExp to match kicks
	var kickRegExp = new RegExp('^' + timeRegExpString + ' ([^ ]+) kicked from [^ ]+ by ([^:]+): (.*)$');

	// RegExp to match topic changes
	var topicRegExp = new RegExp('^' + timeRegExpString + ' Topic changed on [^ ]+ by ([^!]+)!([^:]+): (.*)$');

	// RegExp to match nick changes
	var nickChangeRegExp = new RegExp('^' + timeRegExpString + ' Nick change: ([^ ]+) -> (.+)');

	// RegExp to extract necessary data off a line
	var date = new XDate();

	// Since at the beginning we really don't know what date is on the log lines that come in
	// We need to keep track of the ones we create before knowing the real date, then update them later
	var unknownDate = true;

	this.currentDate = date.toString('ddd MMM dd yyyy');
	this.tzData = 'GMT' + channelConfig.logTimezone;

	// List of timestamps created without knowing the date
	var timeStampsWithUnknownDate = [];
	this.setDate = function(date) {
		this.currentDate = date;

		// If we have timestamps with unknown dates, fix that now
		if( unknownDate===true ) {

			// Get a date for the previous date, since the logs should've been for the previous day
			var newDate =  new XDate( new XDate(this.currentDate + ' 00:00:00 ' + this.tzData).getTime() - (1000 * 60 * 60 * 24) );

			// Extract the interesting components
			var day = newDate.getDate();
			var month = newDate.getMonth();
			var year = newDate.getFullYear();

			// Loop through all created timestamp with bogus dates
			for( var i=0, count=timeStampsWithUnknownDate.length; i<count; ++i ) {

				// And set our new timestamp info to it
				timeStampsWithUnknownDate[i].setDate(day);
				timeStampsWithUnknownDate[i].setMonth(month);
				timeStampsWithUnknownDate[i].setFullYear(year);

				/*
				if( timeStampsWithUnknownDate[i].getTime() > new Date().getTime() ) {
					throw new Error('Something is wrong with log timestamp parsing, got a future time. ' + timeStampsWithUnknownDate[i].toString('yyyy-MM-dd HH:mm:ss') );
				}
				*/

			}

			// No more timestamps to update
			timeStampsWithUnknownDate = [];

			// We now know the date
			unknownDate = false;

			// Disable buffering in the relayer
			this.logRelayer.disableBuffering();
		}
	};

	/**
	 * Parse a log buffer's contents, save data into our LogData object
	 * @param logBuffer {Buffer}
	 */
	this.parse = function(logBuffer) {

		// We were given a buffer, buffers are dull, and difficult to work with, so let's just take a string representation of it
		var logString = logBuffer.toString();

		// Log a new file being parsed
		this.logRelayer.logFile(logString.length);

		// Trim the string, extra linefeeds and such, then save it for use in readLine()
		this.logString = Utils.trim( logString );

		/**
		 * Build the timestamp for a line from the time string, e.g. "14:56"
		 */
		var lineTimestamp = function(hourMinutes, seconds) {

			if( !seconds ) {
				seconds = ':00';
			}

			var date = new XDate(this.currentDate + ' ' + hourMinutes + seconds + ' ' + this.tzData);
			if( unknownDate===true ) {
				timeStampsWithUnknownDate.push(date)
			}

			return date;
		}.bind(this);

		// Read all lines, line by line
		var line, data, timestamp;
		var lineNumber = 0;

		// Enable buffering in the relayer, if we don't know the date yet
		if( unknownDate===true ) {
			this.logRelayer.enableBuffering();
		}
		
		while( line = this.readLine() ) {

			lineNumber++;

			// Does this line tell us a new date?
			if( data = line.match(dateRegExp) ) {

				// Update the current date with the first selection's result
				this.setDate( data[3].replace(' +', ' ') );

			// Is this a line?
			} else if( data = line.match( lineRegExp ) ) {

				// Log this line
				this.logRelayer.log('line', lineTimestamp(data[1], data[2]), {nick: data[3], text: data[4]} );

			// Is it an action?
			} else if( data = line.match(actionRegExp) ) {

				// Log this action
				this.logRelayer.log('action', lineTimestamp(data[1], data[2]), {nick: data[3], text: data[4]} );

			} else if( data = line.match(modeRegExp) ) {

				timestamp = lineTimestamp(data[1], data[2]);

				// This is one of those lines that reveal the nicks' full hostmask, let's make sure we save that data
				this.logRelayer.log('nickHostmask', timestamp, {nick: data[4], hostmask: data[5]});

				// Log this mode change
				this.logRelayer.log('mode', timestamp, {nick: data[4], mode: data[3]} );

			} else if( data = line.match(joinPartRegExp) ) {

				timestamp = lineTimestamp(data[1], data[2]);

				// This is one of those lines that reveal the nicks' full hostmask, let's make sure we save that data
				this.logRelayer.log('nickHostmask', timestamp, {nick: data[3], hostmask: data[4]});

				// Register a join or part depending on which this is
				if( data[4]==='joined' ) {
					this.logRelayer.log('join', timestamp, {nick: data[3]} );
				} else {
					this.logRelayer.log('part', timestamp, {nick: data[3]} );
				}

			} else if( data = line.match(kickRegExp) ) {

				// Log this kick
				this.logRelayer.log('kick', lineTimestamp(data[1], data[2]), {target: data[3], nick: data[4], reason: data[5]});

			} else if( data = line.match(topicRegExp) ) {

				timestamp = lineTimestamp(data[1], data[2]);

				// This is one of those lines that reveal the nicks' full hostmask, let's make sure we save that data
				this.logRelayer.log('nickHostmask', timestamp, {nick: data[3], hostmask: data[4]});

				// Log this topic change
				this.logRelayer.log('topic', timestamp, {nick: data[3], topic: data[5]});

			} else if( data = line.match(nickChangeRegExp) ) {

				// Log this topic change
				this.logRelayer.log('nickChange', lineTimestamp(data[1], data[2]), {fromNick: data[3], toNick: data[4]});

			} else {

				// Unrecognized line, e.g. netsplit, return from netsplit, etc.

			}
		}
	}

};

// All we want to export is our little class
module.exports = EggdropReader;
