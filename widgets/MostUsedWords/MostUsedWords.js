// Generic utils
var Utils = require('../../classes/Utils.js');

/**
 * MostUsedWords widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var MostUsedWords = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'mostUsedWords';
	var name = 'Most used words';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.wordMinLength = channelConfig.wordMinLength;
	this.lines = [];

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		var stats = statsAnalyzer.getStats();

		// Get all the used words in a neat little array
		var wordList = [];
		for( var word in stats.wordUses ) {
			wordList.push({ word: word, uses: stats.wordUses[ word ].count, by: stats.wordUses[ word ].lastUsedBy });
		}

		// Sort it by uses
		wordList.sort( Utils.getArraySort('uses') );

		this.lines = wordList.slice(0, 10);

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

module.exports = MostUsedWords;