// Utility functions
var Utils = require('../classes/Utils.js');

// Stats container
var Stats = require('../classes/Stats.js');

// Logger
var Logger = require('../classes/Logger.js');

/**
 * Create a new LogData instance
 */
var LogData = function(channelConfig) {

	// Save the channel configuration
	this.channelConfig = channelConfig;

	// Create a new stats container
	var stats = new Stats();

	/*

	---------- Nick aliases ----------

	*/

	// Enum-like list of different alias types
	var ALIAS_TYPE = {
		SELF: 0, // This is a key in the config
		CONFIG: 1, // Configuration set this static alias
		DYNAMIC_RULES: 2, // Dynamically created based on config's wildcard/regex rules

		DYNAMIC: 254, // Dynamically created based on monitoring nick changes etc.
		SKIP: 255
	};

	// Static of nick -> alias
	var aliasList = {};

	// List of dynamic rules that can be parsed if no static match is found
	var aliasRules = [];

	/**
	 * Parse user alias configuration into a more useful format
	 */
	this.parseAliasConfig = function() {

		// Loop through the defined nicknames
		for( var nick in this.channelConfig.userConfig ) {

			// Mark this nick as having itself as an alias
			aliasList[ nick.toLowerCase() ] = {
				nick: nick,
				type: ALIAS_TYPE.SELF
			};

			// Loop through the defined aliases for this nick
			for( var i=0, count=this.channelConfig.userConfig[ nick ].aliases.length; i < count; ++i ) {

				// Current item
				var alias = this.channelConfig.userConfig[ nick ].aliases[ i ];

				// Check if this is a static mapping
				if( typeof alias==='string' ) {

					if( alias.indexOf('*')===-1 && alias.indexOf('?')===-1 ) {

						// This looks like a static mapping, create the entry
						aliasList[ alias.toLowerCase() ] = {
							nick: nick,
							type: ALIAS_TYPE.CONFIG
						};

					} else {

						// Ah, looks like we've got wildcards here, convert to regex and put to rules
						aliasRules.push({
							regex: new RegExp( '^' + alias.replace('*', '.*?').replace('?', '.?').toLowerCase() + '$', ""),
							nick: nick
						});

					}

				} else {

					// Looks like a regex, push to rules
					aliasRules.push({
						regex: alias,
						nick: nick
					});

				}
			}

		}

	};

	/**
	 * Try and find any aliases for this nick
	 * @param nick
	 */
	this.getNickAliasData = function(nick) {

		// Convert to lowercase for checks
		var nickLower = nick.toLowerCase();

		// If this nick has no static mapping
		if( aliasList[ nickLower ]===undefined ) {

			var match = false;

			// No static mapping, try dynamic rules
			for( var i=0, count=aliasRules.length; i < count; ++i ) {

				// If current rule matches the nick
				if( aliasRules[i].regex.test(nickLower) ) {

					// Get the new nick
					var newNick = aliasRules[i].nick;

					// Create a static mapping entry, so this will be faster the next time
					aliasList[ nickLower ] = {
						nick: newNick,
						type: ALIAS_TYPE.DYNAMIC_RULES
					};

					match = true;
				}

			}

			if( match===false ) {
				// No aliases found, create a static mapping from the lowercase nick to whatever the nick is now ...
				// ... we don't need to do this again for this nick
				aliasList[ nickLower ] = {
					nick: nick,
					type: ALIAS_TYPE.SKIP
				};
			}

		}

		/*
		var aliasData = aliasList[ nickLower ];
		if( nick!==aliasData.nick ) {
			var nextAliasData = this.getNickAliasData( aliasData.nick );

			if( nextAliasData.nick!==aliasData.nick ) {
				Logger.log('CRITICAL', 'Found a second alias');
				aliasData.nick = nextAliasData.nick;
			}
		}
		*/

		return aliasList[ nickLower ];
	};

	/**
	 * Register an alias for a nick
	 * @param fromNick
	 * @param toNick
	 */
	this.registerAlias = function(fromNick, toNick) {

		// Skip stupid entries, easier to put this here than all the callers
		if( fromNick===toNick ) {
			return;
		}

		// Logger.log('DEBUG', 'Registering alias ' + fromNick + ' -> ' + toNick);

		// Convert fromNick to lowercase
		var fromNickLower = fromNick.toLowerCase();

		// Check if there is an existing entry with higher priority
		if( aliasList[ fromNickLower ] ) {

			// Is this actually already doing what we want it to do?
			if( aliasList[ fromNickLower ].nick===toNick ) {
				return; // Nothing to see here, go away
			}

			if( aliasList[ fromNickLower ].type < ALIAS_TYPE.DYNAMIC ) {
				throw new Error('Trying to create alias ' + fromNick + ' -> ' + toNick + ', but ' + fromNick + ' already had higher priority (' +aliasList[ fromNickLower ].type+ ') alias to ' + aliasList[ fromNickLower ].nick);
			}
		}

		// Register the alias to alias list
		aliasList[ fromNickLower ] = {
			nick: toNick,
			type: ALIAS_TYPE.DYNAMIC
		};

		// And check for any other aliases using the fromNick as a destination
		for( var sourceNick in aliasList ) {
			var destinationAliasData = aliasList[ sourceNick ];
			if( destinationAliasData.nick.toLowerCase() === fromNickLower ) {

				// Update alias
				aliasList[ sourceNick ] = {
					nick: toNick,
					type: ALIAS_TYPE.DYNAMIC
				};

			}
		}

	};

	/**
	 * Register a nick change
	 * @param fromNick
	 * @param toNick
	 */
	this.registerNickChange = function(fromNick, toNick) {

		// Check if they have aliases
		var fromAliasData = this.getNickAliasData(fromNick);
		var toAliasData = this.getNickAliasData(toNick);

		// Logger.log('DEBUG', 'Nick change ' + fromNick + ' (' + fromAliasData.nick + ') -> ' + toNick + ' (' + toAliasData.nick + ')');

		// If they both have aliases
		if( toAliasData.type!==ALIAS_TYPE.SKIP && fromAliasData.type!==ALIAS_TYPE.SKIP ) {

			// If toAlias has higher or equal priority, use it
			if( toAliasData.type <= fromAliasData.type ) {

				// console.log( 'to (' + toAliasData.type + ') < from (' + fromAliasData.type + ')');

				this.registerAlias( fromNick, toAliasData.nick );
				this.registerAlias( fromAliasData.nick, toAliasData.nick );

			// The other way around
			} else {

				// console.log( 'from (' + fromAliasData.type + ') < to (' + toAliasData.type + ')');

				this.registerAlias( toNick, fromAliasData.nick );
				this.registerAlias( toAliasData.nick, fromAliasData.nick );

			}

		// If there was an alias for toNick, use that for fromNick as well
		} else if( toAliasData.type!==ALIAS_TYPE.SKIP ) {

			// console.log( 'to(' + toAliasData.type + ') !== skip');
			this.registerAlias(fromNick, toAliasData.nick);

		// If there was an alias for fromNick, copy that for toNick
		} else if( fromAliasData.type!==ALIAS_TYPE.SKIP ) {

			// console.log( 'from(' + fromAliasData.type + ') !== skip');
			this.registerAlias(toNick, fromAliasData.nick);

		// No old aliases
		} else {

			// console.log( 'to === from === skip');

			// Register a to -> from alias
			this.registerAlias(toNick, fromAliasData.nick);
			if( toNick.toLowerCase() !== toAliasData.nick.toLowerCase() ) {
				this.registerAlias(toAliasData.nick, fromAliasData.nick);
			}

		}

		// Reload the to alias
		toAliasData = this.getNickAliasData(toNick);

		// Tell stats to combine the data, unless these are identical
		if( fromNick!==toAliasData.nick ) {
			stats.combineNicks(fromNick, toAliasData.nick);
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
	 * Source: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
 	 */
	var urlRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))/gi;

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
		nick = this.getNickAliasData(nick).nick;

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
		stats.wordsPerLineByNick[ nick ] = Utils.average(stats.wordsPerLineByNick[ nick ], wordCount, stats.wordsByNick[ nick ]);

		// Last seen
		if( stats.lastSeenByNick[ nick ].getTime() < timestamp.getTime() ) {
			stats.lastSeenByNick[ nick ] = timestamp;
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
		nick = this.getNickAliasData(nick).nick;

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
				target = this.getNickAliasData(target).nick;

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
		nick = this.getNickAliasData(nick).nick;

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
		nick = this.getNickAliasData(nick).nick;

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
		nick = this.getNickAliasData(nick).nick;
		target = this.getNickAliasData(target).nick;

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

		nick = this.getNickAliasData(nick).nick;

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

	var nickAliasStats = null;
	this.getNickAliasStats = function() {

		// If not yet done so, figure out the stats
		if( nickAliasStats===null ) {
			// Start by creating an object
			nickAliasStats = {};

			// Loop through our source -> destination alias list
			for( var sourceNick in aliasList ) {
				var destinationNick = aliasList[ sourceNick ].nick;

				// Initialize destinationNick array if necessary
				nickAliasStats[ destinationNick ] = nickAliasStats[ destinationNick ] || [];

				// And push this source nick in it
				nickAliasStats[ destinationNick ].push( sourceNick );
			}
		}

		return nickAliasStats;
	};

	this.getAliasData = function() {
		return {
			list: aliasList,
			rules: aliasRules,
			nickStats: this.getNickAliasStats()
		};
	};

	/**
	 * Initialize this instance
 	 */
	this.initialize = function() {

		// Parse the alias config
		this.parseAliasConfig();


	};

	this.initialize();

};

// Export the class
module.exports = LogData;

