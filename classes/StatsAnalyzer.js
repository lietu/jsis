// Load the logger class
var Logger = require('../classes/Logger.js');

// Utility functions
var Utils = require('../classes/Utils.js');

// XDate date util
var XDate = require('../lib/xdate.dev.js');

/**
 * Create a new Stats Analyzer, which provides some commonly used stats gathering tools and access to the "raw" stats
 * @param {Stats} stats
 * @constructor
 */
var StatsAnalyzer = function(stats) {

	// Our variables
	this.generated = null;
	this.statsFrom = 0;
	this.statsTo = 0;
	this.numNicks = 0;
	this.numDays = 0;

	/**
	 * Get a random quote by the given nick
	 * @param {String} nick
	 * @return {String} The quote, or empty string if none found
	 */
	this.getRandomQuote = function(nick) {
		return stats.nickLines[ nick ][ Math.floor(Math.random() * stats.nickLines[ nick ].length) ] || '';
	};

	/**
	 * Convert an object with nicks as the key to an array of objects with "nick" and "value"
	 * @param object
	 */
	this.nickObjectToArray = function(object) {

		// The result list
		var list = [];

		// Loop through the nicks in the object
		for( nick in object ) {

			// Push an object to the list with the nick and value
			list.push({nick: nick, value: object[ nick ] });
		}

		// Return the list
		return list;
	};


	/**
	 * Get the percentage that the given number of words is of the total output by the given nick
	 * @param nick
	 * @param wordCount
	 */
	this.getWordPct = function(nick, wordCount) {

		if( wordCount===0 ) {
			return 0;
		}

		return ((wordCount / stats.wordsByNick[ nick ]) * 100).toFixed(2);
	};

	/**
	 * Get the percentage that the given number of lines is of the total output by the given nick
	 * @param nick
	 * @param lineCount
	 */
	this.getLinePct = function(nick, lineCount) {

		if( lineCount===0 ) {
			return 0;
		}

		return ((lineCount / stats.linesByNick[ nick ]) * 100).toFixed(2);
	};


	/**
	 * Get the Stats object, if you want to run more detailed statistics on it
	 */
	this.getStats = function() {
		return stats;
	};

	/**
	 * Calculate some basic statistics, that can't however be calculated on the fly
	 */
	var calculateBasics = function() {

		var startTime = new Date().getTime();

		// Min and maximum date, and their timestamps
		var minDate = { date: null, timestamp: null };
		var maxDate = { date: null, timestamp: null };

		// How many days and nicks have been logged
		var numNicks = 0;

		// Let's determine the min and max dates from the lines by day stats
		var timestamp, date;
		// Loop through dates
		for( date in stats.linesByDay ) {

			// Convert to a timestamp via XDate formatting
			timestamp = new XDate(date).getTime();

			// Check if min date needs to be set
			if( minDate.timestamp===null || timestamp < minDate.timestamp ) {
				minDate.timestamp = timestamp;
				minDate.date = date;
			}

			// Check if max date needs to be set
			if( maxDate.timestamp===null || timestamp > maxDate.timestamp ) {
				maxDate.timestamp = timestamp;
				maxDate.date = date;
			}
		}

		// Calculate number of nicks that have spoken
		for( var i in stats.linesByNick ) { numNicks++; }

		// Make sure our dayly data has no gaps
		timestamp = minDate.timestamp;
		if( timestamp ) {
			while( timestamp <= maxDate.timestamp ) {

				date = new XDate(timestamp).toString('yyyy-MM-dd');

				if( typeof stats.linesByDay[ date ]==='undefined' ) {
					stats.linesByDay[ date ] = 0;
				}

				// Add one day to the timestamp
				timestamp += 1000 * 60 * 60 * 24;
			}
		}

        var from = minDate.date || new XDate();
        var to = maxDate.date || new XDate();

		// Save all the extra data
		this.generated = new XDate();
		this.statsFrom = from.toString('yyyy-MM-dd');
		this.statsTo = to.toString('yyyy-MM-dd');
		this.numNicks = numNicks;
		this.numDays = Math.ceil( (maxDate.timestamp - minDate.timestamp) / 1000 / 60 / 60 / 24 ) + 1;
		stats.numDays = this.numDays;

		var endTime = new Date().getTime();

		Logger.log('DEBUG', 'Basic statistical data for calculated in ' + (endTime - startTime) + ' msec');
	}.bind(this);

	Logger.log('DEBUG', 'Created a statistical analyzer');

	// Calculate the basic data
	calculateBasics();
};

module.exports = StatsAnalyzer;