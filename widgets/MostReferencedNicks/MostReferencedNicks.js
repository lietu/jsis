/**
 * MostReferencedNicks widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var MostReferencedNicks = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'mostReferencedNicks';
	var name = 'Most referenced nicks';

	// The content HTML
	var contentHTML = null;

	// Our variables
	// TODO: Nothing here
	this.nicks = {};

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// TODO: A bit more content around here would be nice

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
		return this.nicks;
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

module.exports = MostReferencedNicks;