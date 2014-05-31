// File system utilities
var fs = require('fs');

// Other utils
var util = require('util');

// XDate date util
var XDate = require('../lib/xdate.dev.js');

/**
 * Utility functions used in multiple classes
 */
var Utils = function() {
	/**
	 * Left-pad a string with something up to a certain length
	 * @param string The string to pad
	 * @param padWith The string to pad with
	 * @param padLength The length to pad until
	 */
	this.leftPad = function( string, padWith, padLength ) {

		// Loop until the string is long enough
	    while(string.length < padLength) {
		    // Prepend it with the padWith string
		    string = padWith + string;
	    }

		// Return result
	    return string;
	};

	/**
	 * Right-pad a string with something up to a certain length
	 * @param string The string to pad
	 * @param padWith The string to pad with
	 * @param padLength The length to pad until
	 */
	this.rightPad = function( string, padWith, padLength ) {

		// Loop until the string is long enough
	    while(string.length < padLength) {
		    // Append the padWith string
		    string = string + padWith;
	    }

		// Return result
	    return string;
	};

	/**
	 * Get the current timestamp
	 */
	this.getTime = function() {
		return this.rightPad( String((new Date().getTime()) / 1000), "0", 14);
	};

	/**
	 * Get a random number
	 * @param min The minimum value to return
	 * @param max The maximum value to return
	 * @return {Number}
	 */
	this.random = function(min, max) {
		return min + Math.floor(Math.random()*max);
	};

	/**
	 * Get a command line argument, or a default value for it if not given
	 * @param parameterName
	 * @param defaultValue
	 */
	this.getArgument = (function() {
		// Arguments given to the application, strip node and javascript file
		var processArgs = process.argv.splice(2);
		var count = processArgs.length;

		return function(parameterName, defaultValue) {

			var parameterLength = parameterName.length;
			for( var i=0; i<count; ++i ) {
				if( processArgs[i].substr(0, parameterLength + 3)==='--' + parameterName + '=' ) {
					return processArgs[i].substr(parameterLength + 3);
				}
			}

			return defaultValue;
		};

	})();

	/**
	 * Trim characters off the beginning and end of a string
	 * @param string
	 * @param characters What characters, defaults to ' \n\r\t', try and make this safe to insert in a RegExp between []
	 * @param regexpFlags What flags to give to new RegExp() .. defaults to ''
	 */
	this.trim = function(string, characters, regexpFlags) {
		// If no characters were given, use default
		if( typeof characters==='undefined' ) {
			characters = ' \n\r\t';
		}

		// Default regexpFlags
		regexpFlags = regexpFlags || '';

		// Replace any number of the characters off the beginning and end of the string
		return string.replace( new RegExp("^[" + characters + "]+", regexpFlags), '' ).replace( new RegExp("[" + characters + "]+$", regexpFlags), '');
	};

	/**
	 * Clone an array, clone objects in it also
	 * @param source
	 */
	this.cloneArray = function(source) {
		var result = [];

		for( var i=0, count=source.length; i<count; ++i ) {

			// Arrays
			if( util.isArray( source[i] )===true ) {

				result[ i ] = this.cloneArray( source[i] );

			// Plain objects
			} else if( typeof source[i]==='object' ) {

				// Just make sure we give a valid value for secondary
				result[i] = this.mergeObjects(source[i], {});

			// Other items we can just set to result
			} else {
				result[i] = source[i];
			}

		}

		return result;
	};

	/**
	 * Merge two objects recursively into a new object
	 * @param primary Primary source of data
	 * @param secondary Secondary source of data, will be used if data was not found in primary source
	 * @return {Object} The merged result
	 */
	this.mergeObjects = function(primary, secondary) {

		var result = {}, key;

		// Loop through items in the primary source
		for( key in primary ) {

			// Arrays
			if( util.isArray( primary[key] )===true ) {

				result[ key ] = this.cloneArray( primary[key] );

			// Plain objects
			} else if( typeof primary[key]==='object' ) {

				// Just make sure we give a valid value for secondary
				result[key] = this.mergeObjects(primary[key], (typeof secondary[key]!=='undefined'?secondary[key]:{}) );

			// Other items we can just set to result
			} else {
				result[key] = primary[key];
			}
		}

		// Now check for any missing items in secondary
		for( key in secondary ) {
			// If current item is not set
			if( typeof result[key]==='undefined' ) {

				// Arrays
				if( util.isArray( secondary[key] )===true ) {

				// Plain objects
				} else if( typeof secondary[key]==='object' ) {
					// ... since primary didn't have this, we can just give an empty object as secondary source
					result[key] = this.mergeObjects(secondary[key], {});

				// Other items we can just set to result
				} else {
					result[key] = secondary[key];
				}
			}
		}

		// Return the resulting object
		return result;
	};

	/**
	 * Calculate an average if you know the old average, a new value to add, and the total number of items in the average
	 * @param oldAverage The old average value
	 * @param newValue The new value to add to the average
	 * @param count How many items in total, including the new value
	 */
	this.average = function(oldAverage, newValue, count) {

		return (((count - 1 ) * oldAverage ) + newValue) / count;
	};

	/**
	 * Copy a file
	 * @param source Source path
	 * @param destination Destination path
	 * @param onReady What to do when it's done
	 */
	this.copyFile = function(source, destination, onReady) {

		// Open a read and write stream
		var readStream = fs.createReadStream(source);
		var writeStream = fs.createWriteStream(destination, {mode: 0660});

		// Read file contents to the write stream, then run the onready callback
		readStream.pipe(writeStream);

		readStream.on('end', onReady);
	};

	/**
	 * Get list of files found under a directory
	 * @param path The path to search
	 * @param recursive If you want recursion
	 * @param onReadyCallback What to run after we're done, will receive a list of files
	 */
	this.getDirectoryFiles = function(path, recursive, onReadyCallback) {

		// Initialize our file list
		var fileList = [];

		// Append the trailing slash if it's not there
		if( path.substr(-1)!=='/' ) {
			path += '/';
		}

		// How many items are we waiting to complete (asynchronous ..)
		var waitingItems = 0;

		// Update waiting items when we need to wait for more async operations
		var wait = function(count) {
			count = count || 1;
			waitingItems += count;
		};

		// Function to process a async process completion
		var asyncComplete = function() {
			// Decrease waiting items, check if we are not waiting for anything anymore
			if( --waitingItems === 0 ) {

				// console.log('Found ' + fileList.length + ' files under ' + path);

				// Run the onready callback, give it our file list
				onReadyCallback( fileList );
			}
		};

		// console.log('Getting files in ' + path);

		wait();

		// Read the directory's contents asynchronously
		fs.readdir(path, function(err, files) {
			if( err ) throw err;

			// console.log('Found ' + files.length + ' items in ' + path);

			// We gotta wait for the async stat() -calls
			wait( files.length );

			// Loop through the files
			for( var i=0, count=files.length; i<count; ++i ) {
				// Build full path to file
				var file = path + files[i];

				// Check what kind of an item it is
				fs.stat(file, (function(file) {

					return function(err, stats) {
						if( err ) {

							if( err.code==='ENOENT' ) {

								// Would log this odd error, but can't load logger
								// Logger.log('WARNING', 'Caught a "No such file or directory" error when trying to stat() ' + file);

								// This async item is complete
								asyncComplete();

								return;
							} else {

								throw err;

							}
						}

						// For directories, we might want to do recursion
						if( recursive && stats.isDirectory() ) {

							// We gotta wait for the next async operation
							wait();

							// The the files in that directory, get the result
							this.getDirectoryFiles(file + '/', true, function(recursiveFileList) {

								// Append the recursive results to our filelist
								fileList = fileList.concat(recursiveFileList);

								// console.log('Found ' + recursiveFileList.length + ' items from the subdirectory ' + file);

								// This async item is complete
								asyncComplete();
							});

						// If this is a file, just put it in the fileList
						} else if( stats.isFile() ) {
							fileList.push(file);
						}

						// This async item is complete
						asyncComplete();
					};

				}).bind(this)(file).bind(this));

			} // For

			// This async item is complete
			asyncComplete();

		}.bind(this));

	};

	/**
	 * Create a directory, recursively
	 * @param path
	 */
	this.mkdir = function(path, mode, onReadyCallback) {

		// Get the nodes of the path, just remove extra // any the trailing / first
		var pathNodes = path.replace(/\/+/, '/').replace(/\/+$/, '').split('/');

		var currentPath = '';

		/**
		 * Process the next path node
		 */
		var nextNode;
		nextNode = function() {

			// Get the first item off the path
			var path = pathNodes.shift();

			// If there was something on the list
			if( path!==undefined ) {

				// Update current path
				currentPath += path + '/';

				// console.log(currentPath);

				// Check what kind of an item it is
				fs.stat(currentPath, function(err, stats) {

					// We're actually expecting errors, that means the folder does not exist
					if( err && err.code==='ENOENT' ) {

						// Create the folder if it doesn't exist, then process the next node
						fs.mkdir(currentPath, mode, nextNode.bind(this));

					// If this is a directory already, process the next node
					} else if( stats && stats.isDirectory() ) {

						nextNode();

					// Any other case
					} else {

						// If there was an unknown error, throw it
						if( err ) throw err;

						// If not, throw our own error
						throw new Error('Error while creating path ' + currentPath + ', maybe there is a file blocking the path creation?');
					}

				}.bind(this) );

			// Nothing left
			} else {
				// Just call the onready callback
				onReadyCallback();
			}
		};

		// Process first node
		nextNode();

	};

	/**
	 * Convert an msec time duration to a usable precision string
	 * @param duration
	 */
	this.durationToString = function(duration) {

		// List of units and how many msec is each
		var units = [
			{name: 'msec', msec:1},
			{name: 'second', msec:1000},
			{name: 'minute', msec:1000 * 60},
			{name: 'hour', msec:1000 * 60 * 60},
			{name: 'day', msec:1000 * 60 * 60 * 24},
			{name: 'week', msec:1000 * 60 * 60 * 24 * 7},
			{name: 'month', msec:1000 * 60 * 60 * 24 * 30},
			{name: 'year', msec:1000 * 60 * 60 * 24 * 365}
		];

		// Components of the final string
		var stringComponents = [];
		var num;

		// Loop through the text
		for( var i = units.length - 1; i>=0; --i ) {

			// If the duration is larger than the current unit
			if( duration >= units[i].msec ) {

				// How many of these units is it?
				num = Math.floor( duration / units[i].msec);

				// Push this string component
				stringComponents.push(num + ' ' + units[i].name + (num>1?'s':'') );

				// Decrease duration by the amount logged
				duration -= num * units[i].msec;
			}

			// We don't want more precision than a couple of words
			if( stringComponents.length>=2 ) {
				break;
			}
		}

		if( stringComponents.length===0 ) {
			return false;
		}


		return stringComponents.join(' and ');

	};

	/**
	 * Get a nice string that says how long it has been since the given timestamp
	 * @param timestamp
	 * @param adjustment Optional, adjust the current time with this amount of msec
	 */
	this.timeSince = function(timestamp, adjustment) {

		// Get current time
		var currentTime = new Date().getTime();

		// If we need adjustment, do that now
		if( adjustment!==undefined ) {
			currentTime += adjustment;
		}

		var text = this.durationToString( currentTime - new XDate(timestamp).getTime() );

		if( text===false ) {
			text = new XDate(timestamp).toString('yyyy-MM-dd HH:mm:ss');
		}

		return text;
	};

	/**
	 * Get the required adjustment in msec from one timezone to another
	 * @param fromTimezone
	 * @param toTimezone
	 * @return {Number}
	 */
	this.getTimezoneAdjustment = (function() {
		var timezoneCache = {};

		return function(fromTimezone, toTimezone) {

			// Matching timezones require no adjustment
			if( fromTimezone===toTimezone ) {
				return 0;
			}

			var identifier = fromTimezone + ' : ' + toTimezone;

			if( timezoneCache[ identifier ]===undefined ) {

				// Create a timestamp to work with
				var timestamp = new XDate();

				// Get the date as a string
				var dateString = timestamp.toString('u');

				// Get the timezone in the string
				var sourceTimezone = timestamp.toString('zzz');

				// Convert the string to one in both the log timezone and stats timezone
				var fromDateString = dateString.replace(sourceTimezone, fromTimezone);
				var toDateString = dateString.replace(sourceTimezone, toTimezone);

				// Then convert them to timestamps
				var fromTimestamp = new XDate(fromDateString);
				var toTimestamp = new XDate(toDateString);

				// Calculate needed adjustment
				timezoneCache[ identifier ] = toTimestamp.getTime() - fromTimestamp.getTime();

			}

			// Return from cache
			return timezoneCache[ identifier ];

		}.bind(this)
	}.bind(this))();

	/**
	 * Get a function to sort an array of objects by a key
	 * @param sortKey
	 */
	this.getArraySort = function(sortKey) {
		return function(first, second) {
			return (second[sortKey] - first[sortKey])
		}
	};

	/**
	 * Find out how many times an item is in an array, optionally calling a callback for every found item
	 * @param {Mixed} needle What to search for
	 * @param {Array} haystack What to search in
	 * @param {Function} callback Optional callback to be called when a match is found, will be given the needle, haystack, and position found in
	 */
	this.arrayCount = function(needle, haystack, callback) {

		// Initialize variables
		var pos = 0;
		var count = 0;

		// Loop until we find no more instances of needle
		while( pos!==-1 ) {

			// Get the next position of needle
			pos = haystack.indexOf( needle, pos );

			// If we found an instance of the needle
			if( pos!==-1 ) {

				// Increment count
				++count;

				// If we had a callback, call it
				if( callback ) {
					callback( needle, haystack, pos );
				}

				// Move up one position so we'll find the next one
				pos += 1;
			}
		}

		return count;
	};

    /**
     * Convert a number of bytes to human readable kiB, MiB, etc.
     * @param {Number} bytes
     */
    this.byteText = function(bytes) {
        var units = ['B', 'kiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        var unit = 0;
        while (bytes > 1024) {
            bytes = bytes / 1024;
            unit++;
        }

        if (unit > 0) {
            bytes = this.round(bytes);
        }

        return bytes + " " + units[unit];
    };

    /**
     * Round a number to given number of decimals. Does not guarantee that it will have
     * that many decimals.
     *
     * @param {Number} number
     * @param {Number} decimals Defaults to 2
     * @return {String}
     */
    this.round = function(number, decimals) {
        decimals = decimals || 2;

        var multiplier = Math.pow(10, decimals);

        return String(Math.round(number * multiplier) / multiplier);
    };
};

// Instancify the Utils to exports
module.exports = new Utils();
