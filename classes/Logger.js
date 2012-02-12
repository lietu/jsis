// Load the configuration
var config = require('../config.js');
var Utils = require('../classes/Utils.js');

// And the modules we need
var fs = require('fs');

// Write functions will be set here, depending on the levels
var logFunctions = {};
// And the streams to write to will be stored here
var logFileStreams = {};

// List of valid log levels
var logLevels = ['DEBUG', 'INFO', 'MESSAGE', 'WARNING', 'ERROR', 'CRITICAL'];

// Define the logger
var Logger = {};

// Are we initialized yet
var initialized = false;
Logger.initialize = function() {
	// Check that we're not initialized yet
	if( initialized ) {
		return;
	}

	// Loop through all log levels
	for( var i=0, count=logLevels.length; i<count; ++i ) {

		// Get this level's name
		var logLevel = logLevels[i];

		// Shorthand for this item
		var levelDestinations = config.log[ logLevel ] || [];

		// If there are no destinations
		if( levelDestinations.length===0 ) {

			// null the function
			logFunctions[ logLevel ] = null;

		} else {

			// We loop through all the files, to open them
			for( var x=0, xcount=levelDestinations.length; x<xcount; ++x ) {

				// Get the current file name
				var file = levelDestinations[x];

				// No need to open anything if this is STDIN or STDERR, will be handled differently
				// Also, first check that this file isn't already open
				if( file!=='STDOUT' && file!=='STDERR' && !logFileStreams[ file ] ) {

					// Open the file, in append mode, with proper permissions etc.
					logFileStreams[ file ] = fs.createWriteStream(file, {
						flags: 'a',
						mode: 0600,
						encoding: 'utf-8'
					});

				}
			}

			// Create a function to write our log entry
			logFunctions[ logLevel ] = (function(levelDestinations, logLevel) {

				// Create a function to actually handle the writing
				return function(message) {

					// Loop through our destinations
					for( var x=0, count=levelDestinations.length; x<count; ++x ) {

						// Current destination
						var destination = levelDestinations[x];

						// STDOUT has special handling
						if( destination==='STDOUT' ) {
							process.stdout.write(message);
						// As does STDERR
						} else if( destination==='STDERR' ) {
							process.stderr.write(message);

						// Other files ...
						} else {

							// Check that the stream exists
							if( logFileStreams[destination] ) {

								// And write
								logFileStreams[destination].write(message);

							// If not found
							} else {

								// This is quite bad, should never happen
								throw new Error('Log file stream not found when trying to write log. Level: "' + logLevel + '", Destination: "' + destination + '"' + "\n" + 'Message: "' + message + '"');

							}
						}
					}

				};

			// Pass in current data, for saving them even when we change them later
			})(levelDestinations, logLevel);
		}
	}

	// Make sure we know we've already done this
	initialized = true;
};


/**
 * Format the log entry
 * @param level The log level
 * @param message The log message
 */
Logger.format = function(level, message) {
	return Utils.getTime() + Utils.leftPad(level, " ", 9) + ': ' + message + "\n";
};

module.exports = {

	/**
	 * Initialize the logger, use this to open files before dropping privileges
	 */
	initialize: function() {
		Logger.initialize();
	},

	/**
	 * Log something
	 * @param level Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL
	 * @param message The message to log
	 */
	log: function(level, message) {

		// Find the correct writer function for this log level
		var logFunction = logFunctions[ level ];

		// Check that this log level is enabled
		if( logFunction ) {

			// Pass through formatting to get a simple string to write
			var logRow = Logger.format(level, message);

			// Write it
			logFunction( logRow );
		}

	}
};