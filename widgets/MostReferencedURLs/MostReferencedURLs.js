// Generic utils
var Utils = require('../../classes/Utils.js');

/**
 * MostReferencedURLs widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var MostReferencedURLs = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'mostReferencedURLs';
	var name = 'Most referenced URLs';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.lines = [];

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// Get the raw stats
		var stats = statsAnalyzer.getStats();

		// Get all the used words in a neat little array
		var urlList = [];
		for( var url in stats.urls ) {
			urlList.push({ url: url, uses: stats.urls[ url ].count, by: stats.urls[ url ].lastUsedBy });
		}

		// Sort it by uses
		urlList.sort( Utils.getArraySort('uses') );

		// And limit to top 10 items
		this.lines = urlList.slice(0, 10);

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

module.exports = MostReferencedURLs;