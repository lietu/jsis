// Utility functions
var Utils = require('../classes/Utils.js');

// XDate date util
var XDate = require('../lib/xdate.dev.js');

/**
 * Create a new LogData instance
 */
var LogData = function(channelConfig) {

	// Save the channel configuration
	this.channelConfig = channelConfig;

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

	// Initialize our stats
	var stats = {

		lines: 0, // Total lines spoken
		modes: 0, // Total mode changes

		linesByHour: zeroHourStats(), // Total lines, per hour
		linesByDay: {}, // Total lines, per date
		linesByDayByHour: {}, // Total lines, per date, per hour
		linesByNick: {}, // Total lines, per nick
		linesByNickByHour: {}, // Total lines, per nick per hour

		averageWordsPerLine: 0, // Average amount of words per line
		lineLength: 0, // Average amount of characters per line

		wordUses: {}, // How many time each word has been used
		urls: {}, // All urls spammed, and how many times
		topics: [], // All topics set
		smileyStats: {}, // How many times each smiley has been used

		wordsByNick: {}, // Total words per nick
		lineLengthByNick: {}, // Average length of lines per nick
		wordsPerLineByNick: {}, // Average number of words per line per nick
		lastSeenByNick: {}, // When were users last seen

		questionsByNick: {}, // Number of questions asked per nick
		shoutsByNick: {}, // Number of times shouted per nick
		allCapsWordsByNick: {}, // Number of words in ALL CAPS said per nick
		attacksByNick: {}, // Number of times aggressive words used per nick
		attackTargetByNick: {}, // Number of times aggressive words targeted at per nick
		unhappySmileysByNick: {}, // Number of unhappy smileys per nick
		happySmileysByNick: {}, // Number of happy smileys per nick
		actionsByNick: {}, // Number of /me actions per nick
		soloByNick: {}, // Number of times soloed per nick
		joinsByNick: {}, // Number of times joined per nick
		foulLanguageByNick: {}, // Number of times foul words used per nick

		kicksReceivedByNick: {}, // Number of kicks received per nick
		kicksGivenByNick: {}, // Number of kicks performed per nick

		opsGivenByNick: {}, // Ops given by nick
		opsTakenByNick: {}, // Ops removed by nick

		voicesReceivedByNick: {}, // Voices received by nick
		voicesGivenByNick: {}, // Voices given by nick
		topicsSetByNick: {} // Topics set by nick


		// statsByNick: {}

	};

	// All lines per nick
	var nickLines = {};

	// Some other internal variables
	var nickChanges = {}; // List of from -> to nickname changes
	var hostUser = {}; // List of hostmask => user
	var userHost = {}; // List of user => hostmask
	var usersInitialized = {};	// List of initialized users

	this.getUserAlias = function(user) {
		// TODO: Missing a few lines of code right about here, also remove the extra horrible code

		return user;
	};

	// Init user stats for this user if needed
	initUserStats = function(user) {
		// If this user hasn't been initialized
		if( !usersInitialized[user] ) {

			// We clear all the *ByNick attributes

			// Loop through all stats
			for( var key in stats ) {

				// If item ends with "ByNick", create an item under there by the user and assign 0
				if( key.substr(-6)==='ByNick' ) {
					stats[ key ][ user ] = 0;
				}

			}

			// There's one per-hour object needed also, create it now
			stats.linesByNickByHour[ user ] = zeroHourStats();

			// Initialize line list
			nickLines[ user ] = [];

			// It has now been initialized
			usersInitialized[user] = true;
		}
	};

	// Solo stats, how long has a single user been talking alone
	var solo = {
		user: null,
		count: 0
	};

	// Some extra variables needed for parseModeString
	var modesWithTargets = 'ohaqvbeI'.split(''); // These modes always have targets, e.g. +o-v foo bar
	var modesWithPositiveTargets = 'klfjgJr'.split(''); // These only have targets when they're preceded with a +

	/**
	 * Parse an IRC mode string, e.g "+k-l+oov pass foo bar baz" into an easier-to-process array, in case of this
	 * example, ["+k pass", "-l", "+o foo", "+o bar", "+v baz"]
	 * @param modeString
	 * @return {Array}
	 */
	this.parseModeString = function(modeString) {
		// Some variables used
		var currentMode, positive, character, needTarget;

		// List of modes this string evaluates to
		var modeList = [];
		var targetPositions = [];

		// Loop through the mode string
		var modePosition = 0;
		for( var i=0, count=modeString.length; i<count; ++i ) {
			// Current character
			character = modeString.substr(i, 1);

			// + and -
			if( character==='+' ) { positive = true; }
			else if ( character==='-' ) { positive = false;	}

			// Space means the end of modes and start of targets
			else if( character===' ' ) {
				break;
			}

			// Update mode
			else {
				currentMode = character;

				// Determine if this mode needs a target or not
				needTarget = false;
				if( modesWithTargets.indexOf(currentMode)!==-1 ) { needTarget = true; }
				else if( positive===true && modesWithPositiveTargets.indexOf(currentMode)!==-1 ) { needTarget = true; }

				// If it does, make sure we note where it needs to go
				if( needTarget ) {
					targetPositions.push( modeList.length );
				}

				modeList.push( (positive?'+':'-') + currentMode );
			}
		}

		// If there's still some of the string left unparsed, it has targets in it
		if( i<count ) {
			// Get the targets
			var targets = modeString.substr(i+1).split(' ');

			// And loop through where to put them
			for( i=0, count=targets.length; i<count; ++i ) {
				// Get the position from targetPositions, and the append a space and the target to the mode
				modeList[ targetPositions[i] ] += ' ' + targets[i];
			}
		}

		// Return a clean list of modes set
		return modeList;
	};

	/**
	 * Register a nick change
	 * @param from
	 * @param to
	 */
	this.registerNickChange = function(from, to) {

		if( typeof nickChanges[to]!=='undefined' ) {

			var fromData = nickChanges[from] || [];
			fromData.push(to);

			// Update user & host linkings
			if( userHost[ from ] ) {
				userHost[ to ] = userHost[ from ];
				hostUser[ userHost[ from ] ] = to;

				// Delete the old user's from mapping
				delete userHost[ from ];
			}

		}
	};

	/**
	 * Clean hostmask a bit to make better matches
	 * @param hostmask
	 */
	this.cleanHostmask = function(hostmask) {
		return hostmask.replace('^[~-+]', '');
	};

	/**
	 * Register a user with a given hostmask
	 * @param user
	 * @param hostmask
	 */
	this.registerUserHostmask = function(user, hostmask) {

		hostmask = this.cleanHostmask( hostmask );

		if( !hostUser[ hostmask ] ) {
			hostUser[ hostmask ] = user;
		}
		if( !userHost[ user ] ) {
			userHost[ user ] = hostmask;
		}

	};

	// A RegExp to select all URLs
	var urlRegex = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi;

	/**
	 * Log a line and update any relevant stats
	 *
	 * @param timestamp An XDate object representing the time the line was logged
	 * @param user The nickname of the user
	 * @param text The text that was said
	 */
	this.addLine = function(timestamp, user, text, isAction) {

		// Initialize the most commonly reused variables here
		var i, count;

		// Calculate some useful data
		var currentTime = timestamp.getTime();
		var words = Utils.trim(text).replace( /[ \r\n\t]+/g, ' ' ).split(' ');
		var wordCount = words.length;
		var hour = Number( timestamp.toString('HH') );
		var date = timestamp.toString('yyyy-MM-dd');


		/*******************************\
		* Update the channel-wide stats *
		\*******************************/

		// Total number of lines, lines per hour, as well as lines per day
		stats.lines++;
		stats.linesByHour[ hour ]++;

		stats.linesByDay[ date ] = stats.linesByDay[ date ] || 0;
		stats.linesByDay[ date ]++;

		// ... and lines by day by hour stats
		stats.linesByDayByHour[ date ] = stats.linesByDayByHour[ date ] || zeroHourStats();
		stats.linesByDayByHour[ date ][ hour ]++;

		// Update average words per line and chars per line
		stats.averageWordsPerLine = Utils.average(stats.averageWordsPerLine, wordCount, stats.lines);
		stats.lineLength = Utils.average(stats.lineLength, text.length, stats.lines);

		// Update all word stats
		for( i=0; i<wordCount; ++i ) {
			stats.wordUses[ words[i] ] = stats.wordUses[ words[i] ] || { count: 0, lastUsedBy: null};

			stats.wordUses[ words[i] ].count++;
			stats.wordUses[ words[i] ].lastUsedBy = user;
		}

		// Get the URLs on this line
		var lineUrls = text.match(urlRegex);
		// If some were found
		if( lineUrls!==null ) {

			// Update the url stats for all of them
			for( i=0, count=lineUrls.length; i<count; ++i ) {
				stats.urls[ lineUrls[i] ] = stats.urls[ lineUrls[i] ] || { count: 0, lastUsedBy: null};

				stats.urls[ lineUrls[i] ].count++;
				stats.urls[ lineUrls[i] ].lastUsedBy = user;
			}
		}


		/***************************\
		* Update the per-user stats *
		\***************************/

		// Get the alias of this user
		user = this.getUserAlias(user);

		// Make sure the user's stats are initialized
		initUserStats(user);

		// Push this line
		nickLines[ user ].push(text);

		// If this is a user continuing their solo rant, increment line count
		if( solo.user===user ) {
			solo.count++;
		// If not, reset
		} else {

			// Check if the previous run qualifies as a solo, if so, log it
			if( solo.count >= this.channelConfig.soloLength ) {
				stats.soloByNick[ user ]++;
			}

			solo = {
					user: user,
					count: 0
			};
		}

		// Increment per-user counts
		stats.linesByNick[ user ]++;
		stats.wordsByNick[ user ] += wordCount;
		stats.linesByNickByHour[ user ][ hour ]++;

		// And recalculate average line length and words per line
		stats.lineLengthByNick[ user ] = Utils.average(stats.lineLengthByNick[ user ], text.length, stats.linesByNick[ user ]);
		stats.wordsPerLineByNick[ user ] = Utils.average(stats.wordsPerLineByNick[ user ], wordCount, stats.linesByNick[ user ]);

		// Last seen
		if( stats.lastSeenByNick[ user ] < currentTime ) {
			stats.lastSeenByNick[ user ] = currentTime;
		}

		// If this is an action, increment that count as well
		if( isAction===true ) {	stats.actionsByNick[ user ]++; }

		// Does it look like a question?
		if( text.indexOf('?')!==-1 ) { stats.questionsByNick[ user ]++; }

		// Does it look like shouting?
		if( text.indexOf('!')!==-1 ) { stats.shoutsByNick[ user ]++; }

		// Are any of the words all CAPS?
		for( i=0; i<wordCount; ++i ) {

			if( words[i] === words[i].toUpperCase() ) {
				stats.allCapsWordsByNick[ user ]++;
			}

		}

		// Are any of the words aggressive?
		for( i=0, count=this.channelConfig.aggressiveWords.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.aggressiveWords[i] )!==-1 ) {
				stats.attacksByNick[ user ]++;
			}

		}

		// TODO: stats.attackTargetByNick

		// Are any of the words foul words?
		for( i=0, count=this.channelConfig.foulWords.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.foulWords[i] )!==-1 ) {
				stats.foulLanguageByNick[ user ]++;
			}

		}

		// Are any of the words happy smileys?
		for( i=0, count=this.channelConfig.happySmileys.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.happySmileys[i] )!==-1 ) {
				stats.happySmileysByNick[ user ]++;

				stats.smileyStats[ this.channelConfig.happySmileys[i] ] = stats.smileyStats[ this.channelConfig.happySmileys[i] ] || {count: 0, lastUsedBy: null};

				stats.smileyStats[ this.channelConfig.happySmileys[i] ].count++;
				stats.smileyStats[ this.channelConfig.happySmileys[i] ].lastUsedBy = user;
			}

		}

		// Are any of the words unhappy smileys?
		for( i=0, count=this.channelConfig.unhappySmileys.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.unhappySmileys[i] )!==-1 ) {
				stats.unhappySmileysByNick[ user ]++;

				stats.smileyStats[ this.channelConfig.unhappySmileys[i] ] = stats.smileyStats[ this.channelConfig.unhappySmileys[i] ] || {count: 0, lastUsedBy: null};

				stats.smileyStats[ this.channelConfig.unhappySmileys[i] ].count++;
				stats.smileyStats[ this.channelConfig.unhappySmileys[i] ].lastUsedBy = user;
			}

		}

	};

	/**
	 * Log a mode change
	 *
	 * @param timestamp An XDate object representing the time the mode change was logged
	 * @param mode The mode string
	 * @param user The nickname of the user who set the mode
	 */
	this.addMode = function(timestamp, mode, user) {

		stats.modes++;

		// Get the alias of this user
		user = this.getUserAlias(user);

		// Make sure the user's stats are initialized
		initUserStats(user);

		// The IRC mode string is a pain, e.g. '-k+l-v+b 3 a *!*@*', so let's parse it to a useful array of 'mode target', e.g. ['-k', '+l 3', '-v a', '+b *!*@*']
		var modes = this.parseModeString(mode);

		// Loop through them
		for( var i=0, count=modes.length; i<count; ++i ) {

			// Current mode and target
			mode = modes[i].substr(0, 2);
			target = modes[i].substr(3);


			// Parse modes into interesting stats
			if( mode==='+o' ) {
				stats.opsGivenByNick[ user ]++;
			} else if( mode==='-o' ) {
				stats.opsTakenByNick[ user ]++;
			} else if( mode==='+v' ) {
				stats.voicesGivenByNick[ user ]++;

				// Get the alias of this target
				target = this.getUserAlias(target);

				// Make sure the target user's stats are initialized
				initUserStats(target);

				stats.voicesReceivedByNick[ target ]++;
			}
		}
	};

	/**
	 * Log a join by a user
	 * @param user The nickname of the joined user
	 */
	this.addJoin = function(user) {

		// Process aliases
		user = this.getUserAlias(user);

		// Make sure the target user's stats are initialized
		initUserStats(user);

		stats.joinsByNick[ user ]++;
	};

	/**
	 * Log the parting of a user
	 * @param user The nickname of the user who parted
	 */
	this.addPart = function(user) {

		// Process aliases
		user = this.getUserAlias(user);

		// Make sure the target user's stats are initialized
		initUserStats(user);

		// We're really not doing any stats on this
		// stats.partsByNick[ user ]++;
	};

	/**
	 * Log a kick
	 *
	 * @param target Who got kicked
	 * @param user By whom
	 * @param reason For what reason
	 */
	this.addKick = function(target, user, reason) {

		// Process aliases
		user = this.getUserAlias(user);
		target = this.getUserAlias(target);

		// Make sure the users' stats are initialized
		initUserStats(target);
		initUserStats(user);

		// Log the kicks received and given
		stats.kicksReceivedByNick[ target ]++;
		stats.kicksGivenByNick[ user ]++;

	};

	/**
	 * Log a topic change
	 *
	 * @param timestamp When was it changed
	 * @param user Who changed it
	 * @param topic And what did they change it to
	 */
	this.addTopic = function(timestamp, user, topic) {

		user = this.getUserAlias(user);

		stats.topics.push({
			topic: topic,
			who: user,
			when: timestamp
		});

		stats.topicsSetByNick[ user ]++;
	};

	/**
	 * Get data for daily activity
	 */
	this.dailyActivityData = function() {

		var i;

		// Collect the data here
		var data = {
			dateList: [],
			hourList: [],
			graphData: {
				night: [],
				morning: [],
				day: [],
				evening: []
			},
			tooltipData: []
		};

		// Create a list of hours
		for( i=0; i < 24; ++i ) { data.hourList.push(i); }

		// And dates
		i=0;
		var mod = Math.floor(stats.numDays / 5);
		var fullDateList = [];
		for( var date in stats.linesByDayByHour ) {

			fullDateList.push(date);

			// Include the first and last item, as well as a few in between
			if( i===0 || i===stats.numDays-1 || i%mod===0 ) {
				data.dateList.push( date );
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
			data.graphData.night.push(dayData.night);
			data.graphData.morning.push(dayData.morning);
			data.graphData.day.push(dayData.day);
			data.graphData.evening.push(dayData.evening);

			i++;
		}

		// Collect the tooltip data
		var times = ['night', 'morning', 'day', 'evening'], text;
		for( i=0, count=times.length; i<count; ++i ) {
			for( var ii=0, iicount=data.graphData[ times[i] ].length; ii<iicount; ++ii ) {

				// Build a string that says, e.g. "22 @ night of 2012-01-01"
				text = data.graphData[ times[i] ][ ii ] + ' @ ' + times[i] + ' of ' + fullDateList[ii];

				// Push to tooltip list
				data.tooltipData.push( text );
			}
		}

		// Convert some of the data to JSON for easier JS insertion
		data.dateList = JSON.stringify( data.dateList );
		data.tooltipData = JSON.stringify( data.tooltipData );
		data.graphData.night = JSON.stringify( data.graphData.night );
		data.graphData.day = JSON.stringify( data.graphData.day );
		data.graphData.morning = JSON.stringify( data.graphData.morning );
		data.graphData.evening = JSON.stringify( data.graphData.evening );

		// Return it
		return data;
	};

	/**
	 * Get data for daily activity
	 */
	this.mostActiveTimesData = function() {

		// Collect the data here
		var data = {
			hourList: [],
			graphData: [],
			tooltipData: []
		};

		// Create a list of hours
		for( var i=0; i < 24; ++i ) { data.hourList.push(i); }

		// And dates
		for( var hour in stats.linesByHour ) {

			// Push the data point
			data.graphData.push( stats.linesByHour[ hour ] );

			// And the tooltip
			data.tooltipData.push( stats.linesByHour[ hour ] + ' @ ' + hour + ':00 - ' + hour + ':59' );
		}

		// Convert some of the data to JSON for easier JS insertion
		data.hourList = JSON.stringify( data.hourList );
		data.tooltipData = JSON.stringify( data.tooltipData );
		data.graphData = JSON.stringify( data.graphData );

		// Return it
		return data;
	};

	var userObjectToArray = function(object) {
		// Build an array of users, we need one to be able to sort it
		var userList = [];
		for( nick in object ) {
			userList.push({nick: nick, value: object[nick] });
		}

		return userList;
	};

	/**
	 * Get a function to sort an array of objects by a key
	 * @param sortKey
	 */
	var getArraySort = function(sortKey) {
		return function(first, second) {
			return (second[sortKey] - first[sortKey])
		}
	};

	this.mostActiveNicksData = function() {

		var nick, userData;

		// Data for the component
		var data = {
			userList: []
		};

		// Function to get a random quote for any nick
		var getRandomQuote = function(nick) {
			return nickLines[ nick ][ Math.floor(Math.random() * nickLines[ nick ].length) ] || '';
		};

		// Function to sort our users
		var sortUsers = getArraySort('value');

		// Build an array of users, we need one to be able to sort it
		var userList = userObjectToArray( stats.linesByNick );

		// Sort it
		userList.sort(sortUsers);

		// Make it a bit smaller
		if( userList.length>30 ) {
			userList.splice(30);
		}

		// Now that we know who we want to show, let's collect the rest of the data
		for( var i=0, count=userList.length; i<count; ++i ) {

			userData = {};

			userData.nick = userList[i].nick;
			userData.lines = userList[i].value;

			// TODO: This should be thought of
			userData.when = '';

			userData.words = stats.wordsByNick[ userData.nick ];
			userData.wordsPerLine = stats.wordsPerLineByNick[ userData.nick ].toFixed(2);
			userData.charsPerLine = stats.lineLengthByNick[ userData.nick ].toFixed(2);
			userData.lastSeen = Utils.timeSince( stats.lastSeenByNick[ userData.nick ] );
			userData.randomQuote = getRandomQuote( userData.nick );

			// Replace user list item
			userList[i] = userData;
		}

		// Assign userlist to data
		data.userList = userList;

		return data;
	};

	this.mostActiveNicksByHourData = function() {

		var nick, i, ii, count;

		// Data for the component
		var data = {
			groupList: {
				night: [],
				morning: [],
				day: [],
				evening: []
			}
		};

		// Build a user array of the interesting data
		var userList = userObjectToArray( stats.linesByNickByHour );

		// Build separate groups to sort per time of day
		var groups = ['night', 'morning', 'day', 'evening'];

		// Loop through the users and build the data
		for( i=0, count=userList.length; i<count; ++i ) {
			var userData = {
				night: 0,
				morning: 0,
				day: 0,
				evening: 0
			};

			// Group the hourly data
			for( var hour=0; hour < 24; ++hour ) {

				if( hour>=0 && hour <= 5) {
					userData.night += userList[ i ].value[ hour ];

				} else if( hour>=6 && hour <= 11) {
					userData.morning += userList[ i ].value[ hour ];

				} else if( hour>=12 && hour <= 17) {
					userData.day += userList[ i ].value[ hour ];

				} else if( hour>=18 && hour <= 23) {
					userData.evening += userList[ i ].value[ hour ];

				}

			}

			// And then put this data in the groupList
			for( ii=0, iicount=groups.length; ii<iicount; ++ii ) {
				data.groupList[ groups[ ii ] ].push({nick: userList[ i ].nick, lines: userData[ groups[ ii ] ] });
			}
		}

		var sortUsers = getArraySort('lines');

		// Sort and limit all of the groups
		for( ii=0, iicount=groups.length; ii<iicount; ++ii ) {

			// First sort
			data.groupList[ groups[ ii ] ].sort(sortUsers);

			// Then make then a bit smaller
			if( data.groupList[ groups[ ii ] ].length>10 ) {
				data.groupList[ groups[ ii ] ].splice(10);
			}

		}

		return data;
	};

	/**
	 * Get the percentage that the given number of words is of the total output by the given nick
	 * @param nick
	 * @param wordCount
	 */
	var getWordPct = function(nick, wordCount) {

		if( wordCount===0 ) {
			return 0;
		}

		return ((wordCount / stats.wordsByNick[ nick ]) * 100).toFixed(2);
	};

	/**
	 * Get the percentage that the given number of lines is of the total output by the given nick
	 * @param nick
	 * @param lineCount
	 */
	var getLinePct = function(nick, lineCount) {
		if( lineCount===0 ) {
			return 0;
		}

		return ((lineCount / stats.linesByNick[ nick ]) * 100).toFixed(2);
	};

	this.bigNumbersData = function() {
		var data = {
			itemList: []
		};

		// Get the top question asking people
		var topQuestions = userObjectToArray( stats.questionsByNick ).sort( getArraySort('value') );
		if( topQuestions.length>=2 && topQuestions[0].value>0 ) {
			data.itemList.push({
				big: 'Is ' + topQuestions[0].nick + ' stupid or just asking too many questions? They asked ' + topQuestions[0].value + ' questions, which was ' + getLinePct(topQuestions[0].nick, topQuestions[0].value) + '% of their lines.',
				small: topQuestions[1].nick + ' didn\'t know that much either. They asked ' + topQuestions[1].value + ' questions, which was ' + getLinePct(topQuestions[1].nick, topQuestions[1].value) + '% of their lines.'
			});
		}

		// Top shouters
		var topShouts = userObjectToArray( stats.shoutsByNick ).sort( getArraySort('value') );
		if( topShouts.length>=2 && topShouts[0].value>0 ) {
			data.itemList.push({
				big: 'The loudest one was ' + topShouts[0].nick + ', who yelled ' + getLinePct(topShouts[0].nick, topShouts[0].value) + '% of the time.',
				small: 'Another old yeller was ' + topShouts[1].nick + ', who shouted ' + getLinePct(topShouts[1].nick, topShouts[1].value) + '% of the time.'
			});
		}

		// Top ALL CAPS
		var topCaps = userObjectToArray( stats.allCapsWordsByNick ).sort( getArraySort('value') );
		if( topCaps.length>=2 && topCaps[0].value>0 ) {
			data.itemList.push({
				big: 'It seems that ' + topCaps[0].nick + '\'s shift-key is hanging: ' + getWordPct(topCaps[0].nick, topCaps[0].value) + '% of the time he/she wrote in UPPERCASE.',
				small: topCaps[1].nick + ' just forgot to deactivate his/her Caps-Lock. He/she wrote in UPPERCASE ' + getWordPct(topCaps[1].nick, topCaps[1].value) + '% of the time.'
			});
		}

		// Top aggressive word users
		var topAggressors = userObjectToArray( stats.aggressiveWords ).sort( getArraySort('value') );
		if( topAggressors.length>=2 && topAggressors[0].value>0 ) {
			data.itemList.push({
				big: topAggressors[0].nick + ' is a very aggressive person. He/she attacked others ' + topAggressors[0].value + ' times.',
				small: topAggressors[1].nick + ' can\'t control their aggressions, either. He/she picked on others ' + topAggressors[1].value + ' times.'
			});
		}

		// TODO: Top victims

		// Top happy smiley users
		var topSmiles = userObjectToArray( stats.happySmileysByNick ).sort( getArraySort('value') );
		if( topSmiles.length>=2 && topSmiles[0].value>0 ) {
			data.itemList.push({
				big: topSmiles[0].nick + ' brings happiness to the world. ' + getLinePct(topSmiles[1].nick, topSmiles[1].value) + '% of the lines contained smiling faces. :)',
				small: topSmiles[1].nick + ' isn\'t a sad person either, smiling ' + getLinePct(topSmiles[1].nick, topSmiles[1].value) + '% of the time.'
			});
		}

		// Top unhappy smiley users
		var topSad = userObjectToArray( stats.unhappySmileysByNick ).sort( getArraySort('value') );
		if( topSad.length>=2 && topSad[0].value>0 ) {
			data.itemList.push({
				big: topSad[0].nick + ' seems to be sad at the moment: ' + getLinePct(topSad[1].nick, topSad[1].value) + '% of the lines contained sad faces. :(',
				small: topSad[1].nick + ' is also a sad person, crying ' + getLinePct(topSad[1].nick, topSad[1].value) + '% of the time.'
			});
		}

		// Longest lines
		var topLineLength = userObjectToArray( stats.lineLengthByNick ).sort( getArraySort('value') );
		if( topLineLength.length>=2 && topLineLength[0].value>0 ) {
			data.itemList.push({
				big: topLineLength[0].nick + ' wrote the longest lines, averaging ' + topLineLength[0].value.toFixed(1) + ' characters per line',
				small: 'The channel average was ' + stats.lineLength.toFixed(1) + ' characters per line.'
			});
		}

		// Shortest lines
		var shortLineLength = userObjectToArray( stats.lineLengthByNick ).sort( getArraySort('value') ).reverse();
		if( shortLineLength.length>=2 && shortLineLength[0].value>0 ) {
			data.itemList.push({
				big: shortLineLength[0].nick + ' wrote the shortest lines, averaging ' + topLineLength[0].value.toFixed(1) + ' characters per line.',
				small: shortLineLength[1].nick + ' was tight-lipped too, averaging ' + topLineLength[1].value.toFixed(1) + ' characters per line.'
			});
		}

		// Most words
		var topWords = userObjectToArray( stats.wordsByNick ).sort( getArraySort('value') );
		if( topWords.length>=2 && topWords[0].value>0 ) {
			data.itemList.push({
				big: topWords[0].nick + ' spoke a total of ' + topWords[0].value + ' words.',
				small: topWords[0].nick + '\'s faithful follower, ' + topWords[1].nick + ', didn\'t speak so much, only ' + topWords[1].value + ' words.'
			});
		}

		// Most words per line
		var topWordsPerLine = userObjectToArray( stats.wordsPerLineByNick ).sort( getArraySort('value') );
		if( topWordsPerLine.length>=2 && topWordsPerLine[0].value>0 ) {
			data.itemList.push({
				big: topWords[0].nick + ' wrote an average of ' + topWords[0].value + ' words per line.',
				small: 'The channel average was ' + stats.wordsPerLine + ' words per line.'
			});
		}

		return data;
	};

	this.mostUsedWordsData = function() {
		var data = {
			lines: []
		};

		// Get all the used words in a neat little array
		var wordList = [];
		for( var word in stats.wordUses ) {
			wordList.push({ word: word, uses: stats.wordUses[ word ].count, by: stats.wordUses[ word ].lastUsedBy });
		}

		// Sort it by uses
		wordList.sort( getArraySort('uses') );

		data.lines = wordList.slice(0, 10);

		return data;
	};

	this.smileysData = function() {
		var data = {
			lines: []
		};

		// Get all the used words in a neat little array
		var smileyList = [];
		for( var smiley in stats.smileyStats ) {
			smileyList.push({ smiley: smiley, uses: stats.smileyStats[ smiley ].count, by: stats.smileyStats[ smiley ].lastUsedBy });
		}

		// Sort it by uses
		smileyList.sort( getArraySort('uses') );

		data.lines = smileyList.slice(0, 10);

		return data;
	};

	this.mostReferencedURLsData = function() {
		var data = {
			lines: []
		};

		// Get all the used words in a neat little array
		var urlList = [];
		for( var url in stats.urls ) {
			urlList.push({ url: url, uses: stats.urls[ url ].count, by: stats.urls[ url ].lastUsedBy });
		}

		// Sort it by uses
		urlList.sort( getArraySort('uses') );

		data.lines = urlList.slice(0, 10);

		return data;
	};

	this.otherInterestingNumbersData = function() {
		var data = {
			itemList: []
		};

		// TODO: Implement me

		return data;
	};

	this.latestTopicsData = function() {
		var data = {
			lines: []
		};

		data.lines = stats.topics.splice(3);
		for( var i=0, count=data.lines.length; i<count; ++i ) {
			data.lines[i].when = data.lines[i].when.toString('yyyy-MM-dd HH:mm');
		}

		return data;
	};

	// Is the extra data calculated yet?
	var extraDataCalculated = false;

	// Function to calculate "extra data" to the stats, stuff that can't be calculated on-the-fly
	calculateExtraData = function() {

		// If not yet calculated
		if( !extraDataCalculated ) {

			// Min and maximum date, and their timestamps
			var minDate = { date: null, timestamp: null };
			var maxDate = { date: null, timestamp: null };

			// How many days and nicks have been logged
			var numNicks = 0;

			// Let's determine the min and max dates from the lines by day stats
			var timestamp, date;
			// Loop through dates
			for( date in stats.linesByDay ) {

				// Convert to a timestamp via XDate formatting
				timestamp = new XDate(date).getTime();

				// Check if min date needs to be set
				if( minDate.timestamp===null || timestamp < minDate.timestamp ) {
					minDate.timestamp = timestamp;
					minDate.date = date;
				}

				// Check if max date needs to be set
				if( maxDate.timestamp===null || timestamp > maxDate.timestamp ) {
					maxDate.timestamp = timestamp;
					maxDate.date = date;
				}
			}

			// Calculate reporting period
			stats.numDays = Math.round( (maxDate.timestamp - minDate.timestamp) / 1000 / 60 / 60 / 24 );


			// Calculate number of nicks that have spoken
			for( var i in stats.linesByNick ) { numNicks++; }

			// Make sure our dayly data has no gaps
			timestamp = minDate.timestamp;
			while( timestamp <= maxDate.timestamp ) {

				date = new XDate(timestamp).toString('yyyy-MM-dd');

				if( typeof stats.linesByDay[ date ]==='undefined' ) {
					stats.linesByDay[ date ] = 0;
				}

				// Add one day to the timestamp
				timestamp += 1000 * 60 * 60 * 24;
			}

			// Add all the extra data to the stats
			stats.generated = new XDate();
			stats.statsFrom = minDate.date;
			stats.statsTo = maxDate.date;
			stats.numNicks = numNicks;

			// It's now been calculated
			extraDataCalculated = true;
		}

	};

	/**
	 * Get the statistics we have generated from all the data we've been stuffed with
	 */
	this.getStats = function() {

		// Make sure everything extra is also calculated
		calculateExtraData();

		return stats;
	};

};

// Export the class
module.exports = LogData;

