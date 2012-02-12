// Node core & supplemental modules
var fs = require('fs');
var EJS = require('ejs');

// XDate date util
var XDate = require('../lib/xdate.dev.js');

// Our classes
var Utils = require('../classes/Utils.js');
var Logger = require('../classes/Logger.js');

/**
 * Utility functions used in multiple classes
 */
var StatsToHTML = function(stats, logData, channelConfig, startTime, version) {

	// Save given parameters
	this.stats = stats;
	this.logData = logData;
	this.channelConfig = channelConfig;
	this.startTime = startTime;
	this.version = version;
	this.templateData = null;

	this.copyTemplateFiles = function(onReadyCallback) {

		// Path to the theme
		var themePath = 'themes/' + this.channelConfig.theme;

		// Get all files in our template
		Utils.getDirectoryFiles( themePath, true, function(files) {

			// We're going to filter the files list a bit
			var filteredFiles = [];
			// What files do we copy
			var fileFilter = /\.(css|js|jpg|png)$/i;

			// Loop through the files
			for( var i=0, count=files.length; i<count; ++i ) {

				// Check if this file matches the filter
				if( files[i].match(fileFilter) ) {
					// Push to list of filtered files if it does
					filteredFiles.push( files[i] );
				}
			}

			// Replace files list
			files = filteredFiles;

			// Function to copy a single file
			var copyFile;
			copyFile = function() {

				// Get the next file to copy
				var sourceFile = files.shift();

				// If we found one
				if( sourceFile!==undefined ) {

					// Get the filename and path for this file
					var filename = sourceFile.substr( sourceFile.lastIndexOf('/')+1 );
					var sourcePath = sourceFile.substr(0, sourceFile.lastIndexOf('/') );
					var destinationPath = this.channelConfig.destination + sourcePath.substr(themePath.length);

					Logger.log('INFO', 'Writing ' + destinationPath + '/' + filename);

					// Make sure the destination folder exists
					Utils.mkdir(destinationPath, 0770, function() {

						// Then copy the file, once that's done, process the next file
						Utils.copyFile(sourceFile, destinationPath + '/' + filename, copyFile.bind(this) );

					}.bind(this) );

				// No more files?
				} else {
					// Run our callback
					onReadyCallback();
				}
			}.bind(this);

			// Copy the first file
			copyFile();

		}.bind(this) );

	};

	/**
	 * Generate the statistics HTML
	 * @param path
	 * @param onReadyCallback
	 */
	this.generate = function(onReadyCallback) {

		// Let's start building our template datas
		var maxDateTimestamp = new XDate(this.stats.statsTo).getTime();
		var templateData;
		templateData = {
			customHeadHtml: this.channelConfig.customHeadHtml,
			JSISversion: this.version,
			channelName: this.channelConfig.name,
			stats: this.stats
		};

		// All our stats fragments
		var fragments = [
			'dailyActivity', 'mostActiveTimes', 'mostActiveNicks', 'mostActiveNicksByHour',
			'bigNumbers', 'usersWithMostNicknames', 'mostUsedWords', 'mostReferencedNicks',
			'smileys', 'mostReferencedURLs', 'otherInterestingNumbers', 'latestTopics'
		];

		var renderFragment;
		renderFragment = function() {

			// Pick the next fragment to render
			var fragment = fragments.shift();

			// If we've got a fragment to render
			if( fragment!==undefined ) {

				var startTime = new Date().getTime();

				var HTML = function(html) {
					return HTML;
				};

				// Get fragment-specific data
				var fragmentData = (this.logData[ fragment + 'Data' ]?this.logData[ fragment + 'Data' ]():{});

				// And merge it with the template data
				fragmentData = Utils.mergeObjects( fragmentData, templateData );

				// Render our main template with our data
				EJS.renderFile( 'themes/' + this.channelConfig.theme + '/' + fragment + '.ejs', fragmentData, function(err, html) {

					// Throw any errors we might be given
					if( err ) throw err;

					var endTime = new Date().getTime();

					Logger.log('DEBUG', 'Fragment ' + fragment + ' generated in ' + (endTime - startTime) + ' msec');

					// Assign the fragment HTML to the template data
					templateData[ fragment ] = html;

					// Render next fragment
					renderFragment();

				}.bind(this));


			// If we've got no more fragments, run onFragmentsComplete
			} else {
				onFragmentsComplete();
			}

		}.bind(this);

		// What to do once the fragments are all rendered?
		var onFragmentsComplete = function() {

			// Callback for once the index.html has been generated
			var onIndexGenerated = function(err, html) {

				// Throw any errors we might get
				if( err ) throw err;

				// Make sure our destination path exists
				Utils.mkdir(channelConfig.destination, 0770, function() {

					Logger.log('INFO', 'Writing ' + channelConfig.destination + '/index.html');

					// Write the rendered HTML in the index.html file there
					fs.writeFile( channelConfig.destination + '/index.html', html, 'utf8', function() {

						// Once that's done, copy the rest of the template files
						this.copyTemplateFiles.bind(this)(onReadyCallback);

					}.bind(this) );

				}.bind(this));

			}.bind(this);

			// Add our own little statistic
			templateData.stats.timeElapsed = (new Date().getTime() - this.startTime) / 1000;
			Logger.log('MESSAGE', 'Stats generated for ' + this.channelConfig.name + ' in ' + templateData.stats.timeElapsed + ' seconds, writing...');

			// Render our main template with our data
			EJS.renderFile( 'themes/' + this.channelConfig.theme + '/index.ejs', templateData, onIndexGenerated);

		}.bind(this);

		// Render the first fragment
		renderFragment();

	};

};

// Instancify the Utils to exports
module.exports = StatsToHTML;