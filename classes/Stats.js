
/**
 * Statistical data collection class
 */
var Stats = function() {

	/**
	 * Generate an object with hourly statistics, all zeroed
	 */
	var zeroHourStats = function() {
		// Create a new object
		var hourStats = {};

		// Loop through the hours 0 - 23, and assign 0 for each hour
		for( var hour=0; hour<24; ++hour ) {
			hourStats[ hour ] = 0;
		}

		// Return the object
		return hourStats;
	};

	// List of initialized users
	var usersInitialized = {};

	/**
	 * Initialize a user's stats, if not yet done
	 * @param {String} nick The nick
	 */
	this.initNick = function(nick) {

		// If this user hasn't been initialized
		if( !usersInitialized[nick] ) {

			// We clear all the *ByNick attributes

			// Loop through all stats
			for( var key in this ) {

				if( this.hasOwnProperty(key) && typeof this[key]!=='function' ) {

					// Special case, this.lastSeenByNick
					if( key==='lastSeenByNick' ) {

						// We'll create a really old timestamp
						this[ key ][ nick ] = new Date(0);

					// If item ends with "ByNick", create an item under there by the user and assign 0
					} else if( key.substr(-6)==='ByNick' ) {
						this[ key ][ nick ] = 0;
					}

				}

			}

			// There's one per-hour object needed also, create it now
			this.linesByNickByHour[ nick ] = zeroHourStats();

			// Initialize line list
			this.nickLines[ nick ] = [];

			// It has now been initialized
			usersInitialized[ nick ] = true;
		}

	};

	/**
	 * Combine data from fromNick to toNick, clearing out fromNick afterwards
	 * @param fromNick
	 * @param toNick
	 */
	this.combineNicks = function(fromNick, toNick) {

		// Make sure both nicks are initialized
		this.initNick(fromNick);
		this.initNick(toNick);

		// Merge the linesByNickByHour data
		for( var hour=0; hour<24; ++hour ) {

			// Increment toNick stats by fromNick's stats
			this.linesByNickByHour[ toNick ][ hour ] += this.linesByNickByHour[ fromNick ][ hour ];

		}

		// Merge nick lines history
		this.nickLines[ toNick ] = this.nickLines[ toNick ].concat(this.nickLines[ fromNick ]);

		// Update all by-nick calculations
		for( var key in this ) {
			if( this.hasOwnProperty(key) && typeof this[key]!=='function' ) {

				// Special case, this.lastSeenByNick
				if( key==='lastSeenByNick' ) {

					// If we have both, we'll use whatever timestamp is larger
					if( this[ key ][ toNick ] < this[ key ][ fromNick ] ) {

						this[ key ][ toNick ] = this[ key ][ fromNick ];
					}

				// If item ends with "ByNick"
				} else if( key.substr(-6)==='ByNick' ) {

					// Increment toNick stats by fromNick's stats
					this[ key ][ toNick ] += this[ key ][ fromNick ];

					// Then delete the fromNick data
					delete this[ key ][ fromNick ];

				}

			}

		}

		// Delete The old variables
		delete this.linesByNickByHour[ fromNick ];
		delete this.nickLines[ fromNick ];

		// Make sure we don't think it's initialized anymore
		delete usersInitialized[ fromNick ];
	};

	/**
	 * Initialize a day's data containers
	 * @param {String} Date of the day, e.g. 2012-01-01
	 */
	this.initDay = (function() {
		// List of initialized days
		var daysInitialized = {};

		return function(day) {
			// If this day is not yet initialized, do so
			if( !daysInitialized[day] ) {

				// We clear all the *ByDay attributes

				// Loop through all stats
				for( var key in this ) {

					if( this.hasOwnProperty(key) && typeof this[key]!=='function' ) {

						// If item ends with "ByDay", create an item under there by the day and assign 0
						if( key.substr(-6)==='ByDay' ) {
							this[ key ][ day ] = 0;
						}

					}

				}
				// There's one per-hour object needed also, create it now
				this.linesByDayByHour[ day ] = zeroHourStats();

				// The date is now initialized
				daysInitialized[ day ] = true;
			}
		}.bind(this);
	}).bind(this)();

	// Initialize our statistical data

	this.lines = 0; // Total lines spoken
	this.modes = 0; // Total mode changes
	this.numDays = 0;

	this.wordsByHour = zeroHourStats(); // Total words, per hour
	this.linesByHour = zeroHourStats(); // Total lines, per hour
	this.linesByDay = {}; // Total lines, per date
	this.linesByDayByHour = {}; // Total lines, per date, per hour
	this.linesByNick = {}; // Total lines, per nick
	this.linesByNickByHour = {}; // Total lines, per nick per hour

	this.averageWordsPerLine = 0; // Average amount of words per line
	this.lineLength = 0; // Average amount of characters per line

	this.wordUses = {}; // How many time each word has been used
	this.urls = {}; // All urls spammed, and how many times
	this.topics = []; // All topics set
	this.smileyStats = {}; // How many times each smiley has been used

	this.wordsByNick = {}; // Total words per nick
	this.lineLengthByNick = {}; // Average length of lines per nick
	this.wordsPerLineByNick = {}; // Average number of words per line per nick
	this.lastSeenByNick = {}; // When were users last seen

	this.questionsByNick = {}; // Number of questions asked per nick
	this.shoutsByNick = {}; // Number of times shouted per nick
	this.allCapsWordsByNick = {}; // Number of words in ALL CAPS said per nick
	this.attacksByNick = {}; // Number of times aggressive words used per nick
	this.attackTargetByNick = {}; // Number of times aggressive words targeted at per nick
	this.unhappySmileysByNick = {}; // Number of unhappy smileys per nick
	this.happySmileysByNick = {}; // Number of happy smileys per nick
	this.actionsByNick = {}; // Number of /me actions per nick
	this.soloByNick = {}; // Number of times soloed per nick
	this.joinsByNick = {}; // Number of times joined per nick
	this.foulLanguageByNick = {}; // Number of times foul words used per nick

	this.kicksReceivedByNick = {}; // Number of kicks received per nick
	this.kicksGivenByNick = {}; // Number of kicks performed per nick

	this.opsGivenByNick = {}; // Ops given by nick
	this.opsTakenByNick = {}; // Ops removed by nick

	this.voicesReceivedByNick = {}; // Voices received by nick
	this.voicesGivenByNick = {}; // Voices given by nick
	this.topicsSetByNick = {}; // Topics set by nick

	// All lines per nick
	this.nickLines = {};
};



module.exports = Stats;