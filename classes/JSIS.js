// Load and initialize the logger class
var Logger = require('../classes/Logger.js');
Logger.initialize();

// We will need the log data class
var LogData = require('../classes/LogData.js');

// We will need the log relayer class
var LogRelayer = require('../classes/LogRelayer.js');

// And a stats analyzer
var StatsAnalyzer = require('../classes/StatsAnalyzer.js');

// And our utilities
var Utils = require('../classes/Utils.js');

// The Stats 2 HTML code
var StatsToHTML = require('../classes/StatsToHTML.js');

var XDate = require('../lib/xdate.dev.js');

// And the fs and async libs
var fs = require('fs');
var async = require('async');

// And we should read our config
var config = require('../config.js');

var JSIS = function() {

	/**
	 * Everyone needs a version number, even JSIS
	 */
	this.version = '0.9';

	/**
	 * Get a function to parse the contents of a single log file
	 *
	 * @param filename
	 * @param logReader
	 * @param pos
	 * @param onReadyCallback
	 */
	this.getFileReader = function(filename, encoding, logReader, pos, onReadyCallback) {
		return function(err, data) {
			if( err ) throw err;

			// If the files are not encoded in UTF-8, we'll change that
			if( encoding!=='UTF-8' ) {

				// Require Iconv text encoding
				var Iconv = require('iconv').Iconv;

				// Create a new converter
				var iconv = new Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE');
        		Logger.log('DEBUG', 'Converting ' + filename + ' contents to UTF-8');

				// And convert the buffer
				data = iconv.convert(data);
			}

			var startTime = new Date().getTime();
            Logger.log('DEBUG', 'Parsing ' + filename);
			logReader.parse(data);
			var endTime = new Date().getTime();

			Logger.log('INFO', 'File ' + pos + ' ' + filename + ' parsed in ' + (endTime - startTime) + ' msec');

			// Run the on complete callback
			onReadyCallback();
		};
	};

	/**
	 * Make sure the channel config is valid and contains all necessary items
	 *
	 * @param channelConfig The channel's configuration from the config file
	 * @param index The index of the channel in the config file, for error messages
	 * @return {Object} Valid channel config
	 * @throws {Error} In case validation fails
	 */
	this.parseChannelConfig = function( channelConfig, index ) {

		var i, count;

		// What are our mandatory settings?
		var mandatorySettings = ['name', 'logFormat', 'logPath', 'destination'];

		// Loop through them
		for( i=0, count=mandatorySettings.length; i<count; ++i ) {

			// Check that current setting is defined
			var setting = mandatorySettings[i];
			if( !channelConfig[setting] ) {

				// Try and get the channel name for verbosity
				var channelName = (typeof channelConfig.name!=='undefined'?' (' + channelConfig.name + ')':'');

				// And throw an error
				throw new Error('Channel ' + index + channelName + ' is missing mandatory setting: ' + setting);
			}
		}

		// Default settings
		var defaultChannelConfig = {
			name: null,
			destination: null,
			logFormat: null,
			logPath: null,
			logEncoding: 'UTF-8',

			theme: 'default',
			recursive: true,
			logFileFilter: '',

			customHeadHtml: '',
			logTimezone: null,
			statsTimezone: null,
			statsTimezoneText: null,

			soloLength: 5,
			wordMinLength: 3,
			ignoreWords: 'I a an it to in of and is for on you but the be me not if at so are my it\'s',

			maxLogFiles: Infinity,

			widgets: require('../widgets/config.js'),

			foulWords: 'assface clit cocksucker shitty shity slutty ahole anus arschloch ass asshole assholes asswipe ' +
				'bastard bastards bitch bitches blowjob butthole buttwipe clit cock crap cum cunt cunts dick ' +
				'dildo dyke enema fag faggot fags fuck fucker fuckin fucking fucks gay gays hell helvete jackoff ' +
				'kraut kurwa lesbo mofo motherfucker nazi nazis nigga nigger nigger; nutsack paska pecker penis ' +
				'perse pussy queer queers skank schlong screw screwing shit shits shitter skank slut sluts spic ' +
				'twat vagina vittu wank whore ',

			// TODO: Need more comprehensive lists
			aggressiveWords: 'slaps spanks',
			happySmileys: ':) :P ;) :D :o) :p :oD ;o) ;p',
			unhappySmileys: ':( ;( ' +
							':/ ;/',

			userConfig: {}
		};

		// Create the config
		var config = {};
		for( var key in defaultChannelConfig ) {

			if( defaultChannelConfig.hasOwnProperty(key)===true ) {

				if( typeof channelConfig[ key ]!=='undefined') {
					config[ key ] = channelConfig[ key ];
				} else {
					config[ key ] = defaultChannelConfig[ key ];
				}

			}
		}

		// Convert ignoreWords to all-lowercase
		config.ignoreWords = config.ignoreWords.toLowerCase();

		var tzItems = ['logTimezone', 'statsTimezone'];
		var reset = true;
		var tzRegex = /[+-][0-9]{2}:[0-9]{2}/;
		for( i=0, count=tzItems.length; i<count; ++i ) {
			reset = false;

			if( config[ tzItems[i] ]===null ) {
				reset = true;
			} else if( tzRegex.test( config[ tzItems[i] ] )===false ) {
				throw new Error('Channel ' + index + ' (' + config.name + ') setting "' + tzItems[i] + '" value "' + config[ tzItems[i] ] + '" does not seem like a valid timezone');
			}

			if( reset===true ) {
				config[ tzItems[i] ] = new XDate().toString('zzz');
			}
		}

		if( config.statsTimezoneText===null ) {
			// Start with the text "GMT"
			config.statsTimezoneText = 'GMT';

			if( config.statsTimezone!=='+00:00' && config.statsTimezone!=='-00:00' ) {
				config.statsTimezoneText += config.statsTimezone;
			}
		}

		// What config settings to split into arrays
		var splitStrings = ['foulWords', 'attackWords', 'happySmileys', 'unhappySmileys', 'ignoreWords'];

		// Loop through them
		for( i=0, count=splitStrings.length; i<count; ++i ) {

			// And any strings we find, split from spaces
			if( typeof config[ splitStrings[i] ]==='string' ) {
				config[ splitStrings[i] ] = Utils.trim(config[ splitStrings[i] ]).replace(' +', ' ').split(' ');
			}
		}

		// Return the finalized config
		return config;
	};

	/**
	 * Get list of log files for the channel
	 *
	 * @param channelConfig Channel configuration
	 * @param onReadyCallback What function to run once we've got the list of files, will be given the file list
	 */
	this.getLogFileList = function(channelConfig, onReadyCallback) {

		Utils.getDirectoryFiles(channelConfig.logPath, channelConfig.recursive, function(files) {

			/**
			 * RegExp that will be used to checked every log filename
			 * E.g. to only parse files that start with "foo.log", you could use /^foo\.log/
			 * ... for help with regular expressions, check:
			 * http://www.visibone.com/regular-expressions/
			 * http://www.cheatography.com/davechild/cheat-sheets/regular-expressions/
			 *
			 * @type {RegExp}
			 */
			// logFileFilter: /.*/,

			Logger.log('DEBUG', 'Found ' + files.length + ' files in ' + channelConfig.logPath);

			// If we have a log file filter
			if( channelConfig.logFileFilter ) {

				Logger.log('DEBUG', 'A log file filter has been set, processing...');


				// Prepare a filtered list
				var filteredList = [];

				// Loop through all the found files
				for( var i=0, count=files.length; i<count; ++i ) {

					// Test against the regex
					if( files[i].match( channelConfig.logFileFilter ) ) {

						// If matched, push to filtered list
						filteredList.push( files[i] );

					} else {
                        Logger.log('DEBUG', files[i] + " did not match " + channelConfig.logFileFilter);
                    }
				}

				Logger.log('DEBUG', 'Filtered out ' + (files.length - filteredList.length) + ' files.');

				// Replace files list with the filtered list
				files = filteredList;
			}

			Logger.log('INFO', 'Found ' + files.length + ' log files for channel ' + channelConfig.name );

			// We want to sort the list, in reverse order
			files.sort().reverse();

			// Call our onready callback, give it the files
			onReadyCallback(files);

		});

	};

	/**
	 * Process the results of the data collection
	 *
	 * @param channelConfig
	 * @param channelLog
	 * @param logReader
	 * @param logRelayer
     * @param callback
	 */
	this.processChannelResults = function(channelConfig, channelLog, logReader, logRelayer, callback) {

		// Make sure any buffered content is un-buffered, in case of a bug
		logRelayer.disableBuffering();

		// Get the alias data from the log
		var aliasData = channelLog.getAliasData();

		// And output it in a human readable format
		Logger.log('INFO', 'Used the following aliases for nicks:');
		for( var nick in aliasData.nickStats ) {
			Logger.log('INFO', nick + ': ' + aliasData.nickStats[ nick ].join(', ') );
		}

		// Do post-processing, e.g. hiding results for "ignored" users
		channelLog.postProcess();

		// Get the stats
		var stats = channelLog.getStats();

		// And wrap it in an analyzer
		var statsAnalyzer = new StatsAnalyzer(stats);

		// Create a new statistics generator
		var statsGenerator = new StatsToHTML(statsAnalyzer, channelConfig, this.startTime, this.version);

		// And tell it to generate the stats
		statsGenerator.generate( function() {

			Logger.log('MESSAGE', 'Statistics for ' + channelConfig.name + ' written to ' + channelConfig.destination + ' .. The stats were based on ' + logRelayer.fileCount + ' files, that contained ' + Utils.byteText(logRelayer.byteCount) + ' bytes of data');
            callback(null);

		});

	};

	/**
	 * Process a single channel
	 *
	 * @param channelConfig
	 * @param channelLog
	 * @param logReader
	 * @param logRelayer
     * @param callback
	 */
	this.processChannel = function(channelConfig, channelLog, logReader, logRelayer, callback) {

		var startTime = new Date().getTime();
		Logger.log('DEBUG', 'Starting to process channel ' + channelConfig.name);

		// Get a list of log files to parse
		var logFiles = this.getLogFileList(channelConfig, function(files) {

			// Which file are we now processing
			var fileIndex = 0;
			// How many files are there?
			var count = files.length;


			// Function to parse the next file in line
			var next;
			next = function() {

				// Have we reached our limit?
				var limitReached = (fileIndex>=channelConfig.maxLogFiles);

				// While we have files remaining, and we've not reached the limit
				if( fileIndex<count && limitReached===false ) {

					// Pick the item to process and increment index
					filename = files[ fileIndex++ ];

					// Build a position string for this item, e.g. "001 / 666"
					var pos = (Utils.leftPad(String(fileIndex), '0', String(count).length)) + ' / ' + count;

					// Read the file, and give it to a file reader, which should call "next" again after it's done
        		    Logger.log('DEBUG', 'Reading ' + filename);
					fs.readFile( filename, 'utf-8', this.getFileReader(filename, channelConfig.logEncoding, logReader, pos, next.bind(this)) );

				// No files remaining, call function to process the results
				} else {

					var endTime = new Date().getTime();

					if( limitReached ) {
						Logger.log('INFO', 'Reached the limit of ' + channelConfig.maxLogFiles + ' log files for ' + channelConfig.name);
					}

					Logger.log('INFO', 'Processed channel ' + channelConfig.name + ' in ' + (endTime - startTime) + ' msec');

					this.processChannelResults(channelConfig, channelLog, logReader, logRelayer, callback);

				}
			}.bind(this);

			// Process next (first) item
			next();

		}.bind(this));
	};

	/**
	 * Start the application
	 */
	this.start = function(callback) {

        callback = callback || function() {};

		// Log this awesome event
		this.startTime = new Date().getTime();

		Logger.log('DEBUG', 'Starting JSIS v' + this.version);

		try {
			var i = 1;
			// Loop through all defined channels
			async.eachSeries(
				config.channels, function(channel, doneCallback) {
	
					// Process the configuration to a useful format
					var channelConfig = this.parseChannelConfig( channel, i++ );

					// Create an object for keeping the logs
					var channelLog = new LogData(channelConfig);

					// Initialize a log relayer
					var logRelayer = new LogRelayer(channelLog, channelConfig);

					// Try and load the log type -specific reader, will crash if not found
					var logReaderClass = require('../classes/LogReaders/' + channelConfig.logFormat + '.js');

					// And instantiate it
					var logReader = new logReaderClass(logRelayer, channelConfig);

					// And start processing the channel
					this.processChannel(channelConfig, channelLog, logReader, logRelayer, doneCallback);

				}.bind(this),
				callback
			);
		} catch( e ) {
			Logger.log('CRITICAL', e.toString() );
			throw( e );

		}

	};

};


module.exports = new JSIS();
