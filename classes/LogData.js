// Utility functions
var Utils = require('../classes/Utils.js');

// Stats container
var Stats = require('../classes/Stats.js');

/**
 * Create a new LogData instance
 */
var LogData = function(channelConfig) {

	// Save the channel configuration
	this.channelConfig = channelConfig;

	// Create a new stats container
	var stats = new Stats();

	/*

	---------- Nick following logic ----------

	... very broken

	*/

	// Some other internal variables
	var nickChanges = {}; // List of from -> to nickname changes
	var hostNick = {}; // List of hostmask => nick
	var nickHost = {}; // List of nick => hostmask

	this.getNickAlias = function(nick) {
		// TODO: Missing a few lines of code right about here, also remove the extra horrible code

		return nick;
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

			// Update nick & host linkings
			if( nickHost[ from ] ) {
				nickHost[ to ] = nickHost[ from ];
				hostNick[ nickHost[ from ] ] = to;

				// Delete the old nick's from mapping
				delete nickHost[ from ];
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
	 * Register a nick with a given hostmask
	 * @param nick
	 * @param hostmask
	 */
	this.registerNickHostmask = function(nick, hostmask) {

		hostmask = this.cleanHostmask( hostmask );

		if( !hostNick[ hostmask ] ) {
			hostNick[ hostmask ] = nick;
		}
		if( !nickHost[ nick ] ) {
			nickHost[ nick ] = hostmask;
		}

	};

	/*


	---------- Helper functions and data for the logic ----------


	 */

	/**
	 * Parse an IRC mode string, e.g "+k-l+oov pass foo bar baz" into an easier-to-process array, in case of this
	 * example, ["+k pass", "-l", "+o foo", "+o bar", "+v baz"]
	 * @param modeString
	 * @return {Array}
	 */
	this.parseModeString = (function() {

		// Some extra variables needed for parseModeString
		var modesWithTargets = 'ohaqvbeI'.split(''); // These modes always have targets, e.g. +o-v foo bar
		var modesWithPositiveTargets = 'klfjgJr'.split(''); // These only have targets when they're preceded with a +

		return function(modeString) {
			// Some variables used
			var currentMode, positive, character, needTarget;

			// List of modes this string evaluates to
			var modeList = [];
			var targetPositions = [];

			// Loop through the mode string
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
	})();

	/**
	 * A RegExp to select all URLs in a line
	 *
 	 */
	var urlRegex = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi;
	// TODO: This sucks, find a better one

	// Solo stats following data, how long has a single nick been talking alone
	var solo = {
		nick: null,
		count: 0
	};

	/**
	 * Log a line and update any relevant stats
	 *
	 * @param timestamp An XDate object representing the time the line was logged
	 * @param nick The nickname of the nick
	 * @param text The text that was said
	 */
	this.addLine = function(timestamp, nick, text, isAction) {

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

		// Initialize the by-day containers
		stats.initDay(date);

		// Total number of lines, lines per hour, as well as lines per day
		stats.lines++;
		stats.linesByHour[ hour ]++;

		stats.linesByDay[ date ]++;

		// ... and lines by day by hour stats
		stats.linesByDayByHour[ date ][ hour ]++;

		// Update average words per line and chars per line
		stats.averageWordsPerLine = Utils.average(stats.averageWordsPerLine, wordCount, stats.lines);
		stats.lineLength = Utils.average(stats.lineLength, text.length, stats.lines);

		// Update all word stats
		for( i=0; i<wordCount; ++i ) {
			stats.wordUses[ words[i] ] = stats.wordUses[ words[i] ] || { count: 0, lastUsedBy: null};

			stats.wordUses[ words[i] ].count++;
			stats.wordUses[ words[i] ].lastUsedBy = nick;
		}

		// Get the URLs on this line
		var lineUrls = text.match(urlRegex);
		// If some were found
		if( lineUrls!==null ) {

			// Update the url stats for all of them
			for( i=0, count=lineUrls.length; i<count; ++i ) {
				stats.urls[ lineUrls[i] ] = stats.urls[ lineUrls[i] ] || { count: 0, lastUsedBy: null};

				stats.urls[ lineUrls[i] ].count++;
				stats.urls[ lineUrls[i] ].lastUsedBy = nick;
			}
		}


		/***************************\
		* Update the per-nick stats *
		\***************************/

		// Get the alias of this nick
		nick = this.getNickAlias(nick);

		// Make sure the nick's stats are initialized
		stats.initNick(nick);

		// Push this line
		stats.nickLines[ nick ].push(text);

		// If this is a nick continuing their solo rant, increment line count
		if( solo.nick===nick ) {
			solo.count++;
		// If not, reset
		} else {

			// Check if the previous run qualifies as a solo, if so, log it
			if( solo.count >= this.channelConfig.soloLength ) {
				stats.soloByNick[ nick ]++;
			}

			solo = {
					nick: nick,
					count: 0
			};
		}

		// Increment per-nick counts
		stats.linesByNick[ nick ]++;
		stats.wordsByNick[ nick ] += wordCount;
		stats.linesByNickByHour[ nick ][ hour ]++;

		// And recalculate average line length and words per line
		stats.lineLengthByNick[ nick ] = Utils.average(stats.lineLengthByNick[ nick ], text.length, stats.linesByNick[ nick ]);
		stats.wordsPerLineByNick[ nick ] = Utils.average(stats.wordsPerLineByNick[ nick ], wordCount, stats.linesByNick[ nick ]);

		// Last seen
		if( stats.lastSeenByNick[ nick ] < currentTime ) {
			stats.lastSeenByNick[ nick ] = currentTime;
		}

		// If this is an action, increment that count as well
		if( isAction===true ) {	stats.actionsByNick[ nick ]++; }

		// Does it look like a question?
		if( text.indexOf('?')!==-1 ) { stats.questionsByNick[ nick ]++; }

		// Does it look like shouting?
		if( text.indexOf('!')!==-1 ) { stats.shoutsByNick[ nick ]++; }

		// Are any of the words all CAPS?
		for( i=0; i<wordCount; ++i ) {

			if( words[i] === words[i].toUpperCase() ) {
				stats.allCapsWordsByNick[ nick ]++;
			}

		}

		// Are any of the words aggressive?
		for( i=0, count=this.channelConfig.aggressiveWords.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.aggressiveWords[i] )!==-1 ) {
				stats.attacksByNick[ nick ]++;
			}

		}

		// TODO: stats.attackTargetByNick

		// Are any of the words foul words?
		for( i=0, count=this.channelConfig.foulWords.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.foulWords[i] )!==-1 ) {
				stats.foulLanguageByNick[ nick ]++;
			}

		}

		// Are any of the words happy smileys?
		for( i=0, count=this.channelConfig.happySmileys.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.happySmileys[i] )!==-1 ) {
				stats.happySmileysByNick[ nick ]++;

				stats.smileyStats[ this.channelConfig.happySmileys[i] ] = stats.smileyStats[ this.channelConfig.happySmileys[i] ] || {count: 0, lastUsedBy: null};

				stats.smileyStats[ this.channelConfig.happySmileys[i] ].count++;
				stats.smileyStats[ this.channelConfig.happySmileys[i] ].lastUsedBy = nick;
			}

		}

		// Are any of the words unhappy smileys?
		for( i=0, count=this.channelConfig.unhappySmileys.length; i<count; ++i ) {

			if( words.indexOf( this.channelConfig.unhappySmileys[i] )!==-1 ) {
				stats.unhappySmileysByNick[ nick ]++;

				stats.smileyStats[ this.channelConfig.unhappySmileys[i] ] = stats.smileyStats[ this.channelConfig.unhappySmileys[i] ] || {count: 0, lastUsedBy: null};

				stats.smileyStats[ this.channelConfig.unhappySmileys[i] ].count++;
				stats.smileyStats[ this.channelConfig.unhappySmileys[i] ].lastUsedBy = nick;
			}

		}

	};

	/**
	 * Log a mode change
	 *
	 * @param timestamp An XDate object representing the time the mode change was logged
	 * @param mode The mode string
	 * @param nick The nickname of the nick who set the mode
	 */
	this.addMode = function(timestamp, mode, nick) {

		stats.modes++;

		// Get the alias of this nick
		nick = this.getNickAlias(nick);

		// Make sure the nick's stats are initialized
		stats.initNick(nick);

		// The IRC mode string is a pain, e.g. '-k+l-v+b 3 a *!*@*', so let's parse it to a useful array of 'mode target', e.g. ['-k', '+l 3', '-v a', '+b *!*@*']
		var modes = this.parseModeString(mode);

		// Loop through them
		for( var i=0, count=modes.length; i<count; ++i ) {

			// Current mode and target
			mode = modes[i].substr(0, 2);
			target = modes[i].substr(3);


			// Parse modes into interesting stats
			if( mode==='+o' ) {
				stats.opsGivenByNick[ nick ]++;
			} else if( mode==='-o' ) {
				stats.opsTakenByNick[ nick ]++;
			} else if( mode==='+v' ) {
				stats.voicesGivenByNick[ nick ]++;

				// Get the alias of this target
				target = this.getNickAlias(target);

				// Make sure the target nick's stats are initialized
				stats.initNick(target);

				stats.voicesReceivedByNick[ target ]++;
			}
		}
	};

	/**
	 * Log a join by a nick
	 * @param nick The nickname of the joined nick
	 */
	this.addJoin = function(nick) {

		// Process aliases
		nick = this.getNickAlias(nick);

		// Make sure the target nick's stats are initialized
		stats.initNick(nick);

		stats.joinsByNick[ nick ]++;
	};

	/**
	 * Log the parting of a nick
	 * @param nick The nickname of the nick who parted
	 */
	this.addPart = function(nick) {

		// Process aliases
		nick = this.getNickAlias(nick);

		// Make sure the target nick's stats are initialized
		stats.initNick(nick);

		// We're really not doing any stats on this
		// stats.partsByNick[ nick ]++;
	};

	/**
	 * Log a kick
	 *
	 * @param target Who got kicked
	 * @param nick By whom
	 * @param reason For what reason
	 */
	this.addKick = function(target, nick, reason) {

		// Process aliases
		nick = this.getNickAlias(nick);
		target = this.getNickAlias(target);

		// Make sure the nicks' stats are initialized
		stats.initNick(target);
		stats.initNick(nick);

		// Log the kicks received and given
		stats.kicksReceivedByNick[ target ]++;
		stats.kicksGivenByNick[ nick ]++;

	};

	/**
	 * Log a topic change
	 *
	 * @param timestamp When was it changed
	 * @param nick Who changed it
	 * @param topic And what did they change it to
	 */
	this.addTopic = function(timestamp, nick, topic) {

		nick = this.getNickAlias(nick);

		stats.topics.push({
			topic: topic,
			who: nick,
			when: timestamp
		});

		stats.topicsSetByNick[ nick ]++;
	};

	/**
	 * Return the collected statistical data
	 */
	this.getStats = function() {
		return stats;
	};

};

// Export the class
module.exports = LogData;

