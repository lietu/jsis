// Generic utils
var Utils = require('../../classes/Utils.js');

/**
 * MostActiveNicksByHour widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var MostActiveNicksByHour = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'mostActiveNicksByHour';
	var name = 'Most active nicks by hour';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.groupList = {
		night: [],
		morning: [],
		day: [],
		evening: []
	};

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		var i, ii, count;

		var stats = statsAnalyzer.getStats();

		// Build a nick array of the interesting data
		var nickList = statsAnalyzer.nickObjectToArray( stats.linesByNickByHour );

		// Build separate groups to sort per time of day
		var groups = ['night', 'morning', 'day', 'evening'];

		// Loop through the nicks and build the data
		for( i=0, count=nickList.length; i<count; ++i ) {
			var nickData = {
				night: 0,
				morning: 0,
				day: 0,
				evening: 0
			};

			// Group the hourly data
			for( var hour=0; hour < 24; ++hour ) {

				if( hour>=0 && hour <= 5) {
					nickData.night += nickList[ i ].value[ hour ];

				} else if( hour>=6 && hour <= 11) {
					nickData.morning += nickList[ i ].value[ hour ];

				} else if( hour>=12 && hour <= 17) {
					nickData.day += nickList[ i ].value[ hour ];

				} else if( hour>=18 && hour <= 23) {
					nickData.evening += nickList[ i ].value[ hour ];

				}

			}

			// And then put this data in the groupList
			for( ii=0, iicount=groups.length; ii<iicount; ++ii ) {
				this.groupList[ groups[ ii ] ].push({nick: nickList[ i ].nick, lines: nickData[ groups[ ii ] ] });
			}
		}

		var sortNicks = Utils.getArraySort('lines');

		// Sort and limit all of the groups
		for( ii=0, iicount=groups.length; ii<iicount; ++ii ) {

			// First sort
			this.groupList[ groups[ ii ] ].sort(sortNicks);

			// Then make then a bit smaller
			if( this.groupList[ groups[ ii ] ].length>10 ) {
				this.groupList[ groups[ ii ] ].splice(10);
			}

		}

		// And finally convert data to string format for view, filling in blanks if necessary
		for( i=0; i<10; ++i ) {

			for( ii=0, iicount=groups.length; ii<iicount; ++ii ) {

				// If this group has this item
				if( this.groupList[ groups[ii] ][ i ] ) {

					// Convert to string
					this.groupList[ groups[ii] ][ i ] = this.groupList[ groups[ii] ][ i ].nick + ' (' + this.groupList[ groups[ii] ][ i ].lines + ')';

				// If not, insert a blank item
				} else {

					this.groupList[ groups[ii] ][ i ] = '';

				}

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

module.exports = MostActiveNicksByHour;