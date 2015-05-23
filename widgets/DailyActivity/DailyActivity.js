/**
 * DailyActivity widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var DailyActivity = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'dailyActivity';
	var name = 'Daily activity';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.dateList = [];
	this.hourList = [];
	this.tooltipData = [];
	this.graphData = {
		night: [],
		morning: [],
		day: [],
		evening: []
	};


	/**
	 * Get data for daily activity
	 */
	this.initialize = function() {

		// Get the actual statistics data
		var stats = statsAnalyzer.getStats();

		var i;

		// Create a list of hours
		for( i=0; i < 24; ++i ) { this.hourList.push(i); }

		// And dates
		i=0;
		var mod = Math.floor(stats.numDays / 5);
		var fullDateList = [];
		for( var date in stats.linesByDayByHour ) {

			if( stats.linesByDayByHour.hasOwnProperty(date)===false ) {
				continue;
			}

			fullDateList.push(date);

			// Include the first and last item, as well as a few in between
			if( i===0 || i===stats.numDays-1 || i%mod===0 ) {
				this.dateList.push( date );
			}

			// At the same time we can build a data structure usable for the graphing
			var dayData = {night: 0, morning: 0, day: 0, evening: 0};
			// We group the lines by day by hour data to 4 daily sections
			for( var hour in stats.linesByDayByHour[ date ] ) {

				if( hour>=0 && hour <= 5) {
					dayData.night += stats.linesByDayByHour[ date ][ hour ];

				} else if( hour>=6 && hour <= 11) {
					dayData.morning += stats.linesByDayByHour[ date ][ hour ];

				} else if( hour>=12 && hour <= 17) {
					dayData.day += stats.linesByDayByHour[ date ][ hour ];

				} else if( hour>=18 && hour <= 23) {
					dayData.evening += stats.linesByDayByHour[ date ][ hour ];

				}
			}

			// However, since we want these as separate lines, we push them to separate lists of data points
			this.graphData.night.push(dayData.night);
			this.graphData.morning.push(dayData.morning);
			this.graphData.day.push(dayData.day);
			this.graphData.evening.push(dayData.evening);

			i++;
		}

		// Collect the tooltip data
		var times = ['night', 'morning', 'day', 'evening'], text;
		for( i=0, count=times.length; i<count; ++i ) {
			for( var ii=0, iicount=this.graphData[ times[i] ].length; ii<iicount; ++ii ) {

				// Build a string that says, e.g. "22 @ night of 2012-01-01"
				text = this.graphData[ times[i] ][ ii ] + ' @ ' + times[i] + ' of ' + fullDateList[ii];

				// Push to tooltip list
				this.tooltipData.push( text );
			}
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
		return {
			dateList: this.dateList,
			//hourList: this.hourList,
			tooltipData: this.tooltipData,
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

module.exports = DailyActivity;