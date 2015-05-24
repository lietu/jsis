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
		var otherTooltips = [];
		for( var hour in stats.linesByHour ) {

			// Push the data point
			this.graphData.words.push( stats.wordsByHour[ hour ] );
			this.graphData.lines.push( stats.linesByHour[ hour ] );

			// And the tooltip
			this.tooltipData.push( stats.wordsByHour[ hour ] + ' @ ' + hour + ':00 - ' + hour + ':59' );
			otherTooltips.push( stats.linesByHour[ hour ] + ' @ ' + hour + ':00 - ' + hour + ':59' );
		}
		this.tooltipData = this.tooltipData.concat(otherTooltips);

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
		return {
			//timezone: this.timezone,
			tooltipData: this.tooltipData,
			hourList: this.hourList,
			graphData: this.graphData
		};
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