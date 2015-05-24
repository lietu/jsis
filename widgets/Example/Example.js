/**
 * Example widget, you could of course consider all the widgets under widgets/* examples on how to do one...
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var Example = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'myExample';
	var name = 'Example data';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.someData = {};

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// Do some stuff to gather data from StatsAnalyzer or the "raw" Stats, save it in our variables
		this.someData.foo = 'bar';

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
		return this.someData;
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

module.exports = Example;