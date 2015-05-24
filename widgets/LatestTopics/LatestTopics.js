/**
 * LatestTopics widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var LatestTopics = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'latestTopics';
	var name = 'Latest topics';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.topics = [];

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// Get the "raw" stats
		var stats = statsAnalyzer.getStats();

        // Sort topics by time
        var sorted = stats.topics.sort(function(first, second) {
			return (second.when.getTime() - first.when.getTime())
		});

		// Get the latest topics
		this.topics = sorted.slice(0,3);

		// Loop through them, and generate a pretty "when" timestamp
		for( var i=0, count=this.topics.length; i<count; ++i ) {
			this.topics[i].when = this.topics[i].when.toString('yyyy-MM-dd HH:mm:ss');
		}


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
		return this.topics;
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

module.exports = LatestTopics;