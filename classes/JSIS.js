// Load and initialize the logger class
var Logger = require('../classes/Logger.js');
Logger.initialize();

// We will need the log data class
var LogData = require('../classes/LogData.js');

// And our utilities
var Utils = require('../classes/Utils.js');

// The Stats 2 HTML code
var StatsToHTML = require('../classes/StatsToHTML.js');

// And the fs lib
var fs = require('fs');

// And we should read our config
var config = require('../config.js');

var JSIS = function() {

	/**
	 * Everyone needs a version number, even JSIS
	 */
	this.version = '0.1';

	/**
	 * Get a function to parse the contents of a single log file
	 *
	 * @param filename
	 * @param logReader
	 * @param pos
	 * @param onReadyCallback
	 */
	this.getFileReader = function(filename, logReader, pos, onReadyCallback) {
		return function(err, data) {
			if( err ) throw err;

			var startTime = new Date().getTime();
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
			theme: 'default',
			recursive: true,
			logFileFilter: '',

			customHeadHtml: '',

			soloLength: 5,

			maxLogFiles: null,

			foulWords: 'assface clit cocksucker shitty shity slutty ahole anus arschloch ass asshole assholes asswipe ' +
				'bastard bastards bitch bitches blowjob butthole buttwipe clit cock crap cum cunt cunts dick ' +
				'dildo dyke enema fag faggot fags fuck fucker fuckin fucking fucks gay gays hell helvete jackoff ' +
				'kraut kurwa lesbo mofo motherfucker nazi nazis nigga nigger nigger; nutsack paska pecker penis ' +
				'perse pussy queer queers scank schlong screw screwing shit shits shitter skank slut sluts spic ' +
				'twat vagina vittu wank whore ',

			// TODO: Need more comprehensive lists
			aggressiveWords: 'slaps spanks',
			happySmileys: ':) ;)',
			unhappySmileys: ':( ;( ' +
							':/ ;/',

			userAliases: {}
		};

		// Merge the channel config with the default channel config and return
		var config = Utils.mergeObjects(channelConfig, defaultChannelConfig);

		// What config settings to split into arrays
		var splitStrings = ['foulWords', 'attackWords', 'happySmileys', 'unhappySmileys'];

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
	 */
	this.processChannelResults = function(channelConfig, channelLog, logReader) {

		// Get the stats (probably calculate the extra data as well
		var startTime = new Date().getTime();
		var stats = channelLog.getStats();
		var endTime = new Date().getTime();

		Logger.log('DEBUG', 'Extra statistical data for ' + channelConfig.name + ' calculated in ' + (endTime - startTime) + ' msec');

		// Create a new statistics generator
		var statsGenerator = new StatsToHTML(stats, channelLog, channelConfig, this.startTime, this.version);

		// And tell it to generate the stats
		statsGenerator.generate( function() {

			Logger.log('MESSAGE', 'Statistics for ' + channelConfig.name + ' written to ' + channelConfig.destination);

		});

	};

	/**
	 * Process a single channel
	 *
	 * @param channelConfig
	 * @param channelLog
	 * @param logReader
	 */
	this.processChannel = function(channelConfig, channelLog, logReader) {

		var startTime = new Date().getTime();
		Logger.log('DEBUG', 'Starting JSIS v' + this.version);

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
					fs.readFile( filename, 'utf-8', this.getFileReader(filename, logReader, pos, next.bind(this)) );

				// No files remaining, call function to process the results
				} else {

					var endTime = new Date().getTime();

					if( limitReached ) {
						Logger.log('INFO', 'Reached the limit of ' + channelConfig.maxLogFiles + ' log files for ' + channelConfig.name);
					}

					Logger.log('INFO', 'Processed channel ' + channelConfig.name + ' in ' + (endTime - startTime) + ' msec');

					this.processChannelResults(channelConfig, channelLog, logReader);

				}
			}.bind(this);

			// Process next (first) item
			next();

		}.bind(this));
	};

	/**
	 * Start the application
	 */
	this.start = function() {

		// Log this awesome event
		this.startTime = new Date().getTime();

		try {

			// Loop through all defined channels
			for( var i=0, numChannels=config.channels.length; i<numChannels; ++i ) {

				// Process the configuration to a useful format
				var channelConfig = this.parseChannelConfig( config.channels[i], i+1 );

				// Initialize a log reader, should crash if not found
				var logReaderClass = require('../classes/LogReaders/' + channelConfig.logFormat + '.js');

				// Create an object for keeping the logs
				var channelLog = new LogData(channelConfig);
				// And instantiate the log reader
				var logReader = new logReaderClass(channelLog);

				// And start processing the channel
				this.processChannel(channelConfig, channelLog, logReader);
			}

		} catch( e ) {

			Logger.log('CRITICAL', e.toString() );
			throw( e );

		}

	};

};


module.exports = new JSIS();