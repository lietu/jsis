var Utils = require('../../classes/Utils.js');
var XDate = require('../../lib/xdate.dev.js');
var Logger = require('../../classes/Logger.js');

/**
 * Parse irssi log string into the LogData object
 * @param {LogData} logData
 */
var IrssiReader = function(logData) {

	/**
	 * @type {LogData}
	 */
	this.logData = logData;

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
	var timeRegExpString = '([0-9]{2}:[0-9]{2})(:[0-9]{2})?';

	// .. and the nickname
	var nicknameRegExpString = '\<[@+% ]?([^>]+)\>';

	// RegExp to match a line that reports a new date and select the date
	var dateRegExpString = '([a-z]{3} +[a-z]{3} +[0-9]{1,2}) +([0-9]{2}:[0-9]{2}:[0-9]{2}) +([0-9]{4})';
	var dateRegExp = new RegExp('^--- Log opened ' + dateRegExpString + '$', 'i');

	// RegExp to match a normal line and an action
	var lineRegExp = new RegExp('^' + timeRegExpString + ' +' + nicknameRegExpString + ' (.*)');
	var actionRegExp = new RegExp('^' + timeRegExpString + '  \\* ([^ ]+) (.*)$');

	// RegExp to match a mode change
	var modeRegExp = new RegExp('^' + timeRegExpString + ' -!- mode/[^ ]+ \\[([^\\]]+)\\] by (.*)$');

	// RegExp to match a join, part or quit
	var joinPartQuitRegExp = new RegExp('^' + timeRegExpString + ' -!- ([^ ]+) \\[([^)]+)\\] has (joined|left|quit) ');

	// RegExp to match kicks
	var kickRegExp = new RegExp('^' + timeRegExpString + ' -!- ([^ ]+) was kicked from [^ ]+ by ([^:]+) \\[([^\\]]*)\\]$');

	// RegExp to match topic changes
	var topicRegExp = new RegExp('^' + timeRegExpString + ' -!- ([^ ]+) changed the topic of [^ ]+ to: (.*)$');

	// RegExp to extract necessary data off a line
	var date = new XDate();

	this.currentDate = null;
	this.tzData = 'GMT'+date.toString('zzz');

	this.setDate = function(date) {
		this.currentDate = date;
	};

	/**
	 * Parse a log buffer's contents, save data into our LogData object
	 * @param logBuffer {Buffer}
	 */
	this.parse = function(logBuffer) {

		// We were given a buffer, buffers are dull, and difficult to work with, so let's just take a string representation of it
		var logString = logBuffer.toString();

		// Trim the string, extra linefeeds and such, then save it for use in readLine()
		this.logString = Utils.trim( logString );

		/**
		 * Build the timestamp for a line from the time string, e.g. "14:56"
		 */
		var lineTimeStamp = function(hourMinutes, seconds) {

			if( !seconds ) {
				seconds = ':00';
			}

			var date = new XDate(this.currentDate + ' ' + hourMinutes + seconds + ' ' + this.tzData);

			return date;
		}.bind(this);


		// Read all lines, line by line
		var line, data;
		var lineNumber = 0;
		while( line = this.readLine() ) {

			lineNumber++;

			// Does this line tell us a new date?
			if( data = line.match(dateRegExp) ) {

				var newDate = data[1].replace(' +', ' ') + ' ' + data[3].replace(' +', ' ');

				// Update the current date with the first selection's result
				this.setDate( newDate );

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to contain a new date: ' + newDate);



			// Is this a line?
			} else if( data = line.match( lineRegExp ) ) {

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to be someone talking: ' + JSON.stringify(data));


				// Give our data to the LogData object
				logData.addLine( lineTimeStamp(data[1], data[2]), /* nick */ data[3], /* and the text */ data[4], false);

			} else if( data = line.match(actionRegExp) ) {

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to be an action: ' + JSON.stringify(data));

				logData.addLine( lineTimeStamp(data[1], data[2]), /* nick */ data[3], /* and the text */ data[4], true);

			} else if( data = line.match(modeRegExp) ) {

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to be a mode change: ' + JSON.stringify(data));

				logData.addMode( lineTimeStamp(data[1], data[2]), data[3], data[4] );

			} else if( data = line.match(joinPartQuitRegExp) ) {

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to be a join, part or quit: ' + JSON.stringify(data));

				// This is one of those lines that reveal the nicks' full hostmask, let's make sure we save that data
				logData.registerNickHostmask(data[3], data[4]);

				// Register a join or part depending on which this is
				if( data[4]==='joined' ) {
					logData.addJoin( data[3] );
				} else {
					logData.addPart( data[3] );
				}

			} else if( data = line.match(kickRegExp) ) {

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to be a kick: ' + JSON.stringify(data));

				logData.addKick( data[3], data[4], data[5] );

			} else if( data = line.match(topicRegExp) ) {

				// Logger.log('DEBUG', 'Line ' + lineNumber + ' seems to be a topic change: ' + JSON.stringify(data));

				logData.addTopic( lineTimeStamp(data[1], data[2]), data[3], data[4]);

			} else {

				// Unrecognized line, e.g. netsplit, return from netsplit, etc.

				// Logger.log('WARNING', 'Line ' + lineNumber + ' was not recognized: "' + line + '"')
			}
		}
	}

};

// All we want to export is our little class
module.exports = IrssiReader;
