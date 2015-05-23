// Generic utils
var Utils = require('../../classes/Utils.js');

/**
 * MostActiveNicks widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var MostActiveNicks = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'mostActiveNicks';
	var name = 'Most active nicks';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.nickList = []

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		var nick, nickData;

		var stats = statsAnalyzer.getStats();

		// Function to sort our nicks
		var sortNicks = Utils.getArraySort('value');

		// Build an array of nicks, we need one to be able to sort it
		var nickList = statsAnalyzer.nickObjectToArray( stats.linesByNick );

		// Sort it
		nickList.sort(sortNicks);

		// Make it a bit smaller
		if( nickList.length>30 ) {
			nickList.splice(30);
		}

		// Now that we know who we want to show, let's collect the rest of the data
		for( var i=0, count=nickList.length; i<count; ++i ) {

			nickData = {};

			nickData.nick = nickList[i].nick;
			nickData.lines = nickList[i].value;

			// TODO: This should be thought of
			nickData.when = '';

			nickData.words = stats.wordsByNick[ nickData.nick ];
			nickData.wordsPerLine = stats.wordsPerLineByNick[ nickData.nick ].toFixed(2);
			nickData.charsPerLine = stats.lineLengthByNick[ nickData.nick ].toFixed(2);
			nickData.lastSeen = Utils.timeSince( stats.lastSeenByNick[ nickData.nick ], Utils.getTimezoneAdjustment( channelConfig.logTimezone, channelConfig.statsTimezone ) );
			nickData.randomQuote = statsAnalyzer.getRandomQuote( nickData.nick );

			// Replace nick list item
			nickList[i] = nickData;
		}

		// Assign nicklist to data
		this.nickList = nickList;

	};


	/**
	 * Get our ID
	 */
	this.getId = function() {
		return id;
	};

	/**
	 * Get our name
	 */
	this.getName = function() {
		return name;
	};

	/**
	 * Get the content HTML
	 */
	this.getContent = function() {
		return contentHTML;
	};

	/**
	 * Get the JSON Data
	 */
	this.getJSON = function() {
		return this.nickList;
	};

	/**
	 * Set the content HTML
	 */
	this.setContent = function(html) {
		// Prevent setting it again once it's set
		if( contentHTML===null ) {
			contentHTML = html;
		} else {
			throw new Error('Trying to re-set widget content HTML');
		}
	};


	// Initialize our data
	this.initialize();
};

module.exports = MostActiveNicks;