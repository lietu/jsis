// Generic utils
var Utils = require('../../classes/Utils.js');

/**
 * Smileys Widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var Smileys = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'smileys';
	var name = 'Smiley Usage';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.lines = [];

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// Get the statistics
		var stats = statsAnalyzer.getStats();

		// Get all the used words in a neat little array
		var smileyList = [];
		for( var smiley in stats.smileyStats ) {
			smileyList.push({ smiley: smiley, uses: stats.smileyStats[ smiley ].count, by: stats.smileyStats[ smiley ].lastUsedBy });
		}

		// Sort it by uses
		smileyList.sort( Utils.getArraySort('uses') );

		// Get top 10 and use them
		this.lines = smileyList.slice(0, 10);


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
		return this.lines;
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

module.exports = Smileys;