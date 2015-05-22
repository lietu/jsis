/**
 * MostActiveTimes widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var MostActiveTimes = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'mostActiveTimes';
	var name = 'Most active times';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.timezone = channelConfig.statsTimezoneText;
	this.tooltipData = [];
	this.hourList = [];
	this.graphData = {
		words: [],
		lines: []
	};


	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// Get the actual statistics data
		var stats = statsAnalyzer.getStats();

		// Create a list of hours
		for( var i=0; i < 24; ++i ) { this.hourList.push(i); }

		// And dates
		for( var hour in stats.linesByHour ) {

			// Push the data point
			this.graphData.words.push( stats.wordsByHour[ hour ] );
			this.graphData.lines.push( stats.linesByHour[ hour ] );

			// And the tooltip
			this.tooltipData.push( stats.wordsByHour[ hour ] + ' @ ' + hour + ':00 - ' + hour + ':59' );
			this.tooltipData.push( stats.linesByHour[ hour ] + ' @ ' + hour + ':00 - ' + hour + ':59' );
		}

		// Convert some of the data to JSON for easier JS insertion
		this.hourList = JSON.stringify( this.hourList );
		this.tooltipData = JSON.stringify( this.tooltipData );
		this.graphData.words = JSON.stringify( this.graphData.words );
		this.graphData.lines = JSON.stringify( this.graphData.lines );

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

module.exports = MostActiveTimes;