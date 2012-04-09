// Node core & supplemental modules
var fs = require('fs');
var EJS = require('ejs');

// XDate date util
var XDate = require('../lib/xdate.dev.js');

// Our classes
var Utils = require('../classes/Utils.js');
var Logger = require('../classes/Logger.js');

/**
 * Statistics data to HTML generator
 */
var StatsToHTML = function(statsAnalyzer, channelConfig, startTime, version) {

	// Save given parameters
	this.statsAnalyzer = statsAnalyzer;
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
	 * @param onReadyCallback
	 */
	this.generate = function(onReadyCallback) {

		// Let's start building our template datas
		var maxDateTimestamp = new XDate(this.statsAnalyzer.statsTo).getTime();

		/**
		 * Callback for when widgets have finished rendering
		 * @param widgetHTML Receives the full HTML for the widgets
		 */
		var onWidgetsComplete = function(widgetHTML) {

			// Callback for once the index.html has been generated
			var onIndexGenerated = function(err, html) {

				// Throw any errors we might get
				if( err ) throw err;

				// Make sure our destination path exists
				Utils.mkdir(this.channelConfig.destination, 0770, function() {

					Logger.log('INFO', 'Writing ' + this.channelConfig.destination + '/index.html');

					// Write the rendered HTML in the index.html file there
					fs.writeFile( this.channelConfig.destination + '/index.html', html, 'utf8', function() {

						// Once that's done, copy the rest of the template files
						this.copyTemplateFiles.bind(this)(onReadyCallback);

					}.bind(this) );

				}.bind(this));

			}.bind(this);

			// Template data for the index.html file
			var templateData = {
				customHeadHtml: this.channelConfig.customHeadHtml,
				JSISversion: this.version,
				channelName: this.channelConfig.name,
				timezone: this.channelConfig.statsTimezoneText,
				statsAnalyzer: this.statsAnalyzer,
				widgetHTML: widgetHTML
			};

			// Add our own little statistic to the stats analyzer
			templateData.statsAnalyzer.timeElapsed = (new Date().getTime() - this.startTime) / 1000;

			Logger.log('MESSAGE', 'Stats generated for ' + this.channelConfig.name + ' in ' + templateData.statsAnalyzer.timeElapsed + ' seconds, writing...');

			// Render our main template with the data
			EJS.renderFile( 'themes/' + this.channelConfig.theme + '/index.ejs', templateData, onIndexGenerated);

		}.bind(this);

		// Start rendering widgets
		this.renderWidgets( this.channelConfig.widgets, onWidgetsComplete );
	};

	/**
	 * Render all widgets in the given list
	 * @param widgets List of widget classes to render
	 * @param onReadyCallback What to do when we're done, will be given the HTML
	 */
	this.renderWidgets = function(widgets, onReadyCallback) {

		Logger.log('DEBUG', 'Rendering ' + widgets.length + ' widgets');

		var startTime = new Date().getTime();

		// HTML for all the widgets
		var widgetHTML = '';

		/**
		 * Render the next widget in the queue
		 * @param html
		 */
		var nextWidget;
		var widgetIndex = 0;
		nextWidget = function(html) {

			// Append widget's HTML to our main HTML container
			widgetHTML += html;

			// Do we have any more widgets to process?
			if( widgetIndex<widgets.length ) {

				// Pick the next widget
				var widgetClass = widgets[ widgetIndex++ ];

				// Render it
				this.renderWidget(widgetClass, nextWidget);

			// No? ... phew
			} else {

				var endTime = new Date().getTime();

				Logger.log('DEBUG', 'Widgets rendered in ' + (endTime - startTime) + ' msec');

				// Call our onready callback
				onReadyCallback(widgetHTML);

			}

		}.bind(this);

		// Render the first widget
		nextWidget('');
	};

	/**
	 * Render a single widget
	 * @param widgetClass Name of the widget class
	 * @param onReadyCallback What to do when that's done, will be given the HTML
	 */
	this.renderWidget = function(widgetClass, onReadyCallback) {

		// Null widgets get no output
		if( widgetClass===null ) {
			Logger.log('DEBUG', 'Rendering null widget as an empty string');
			onReadyCallback('');

			// And stop executing this function
			return;
		}

		var startTime = new Date().getTime();

		// Require the widget class
		var widgetConstructor = require('../widgets/' + widgetClass + '/' + widgetClass + '.js');

		Logger.log('DEBUG', 'Creating a new ' + widgetClass + ' widget');

		// Create one
		var widget = new widgetConstructor( this.statsAnalyzer, this.channelConfig );

		// Render it's view
		EJS.renderFile( 'widgets/' + widgetClass + '/' + widgetClass + '.ejs', {widget: widget, channelConfig: this.channelConfig}, function(err, html) {
			if( err ) throw err;

			// Give the widget it's HTML
			widget.setContent(html);

			// Render it in a container
			EJS.renderFile( 'themes/' + this.channelConfig.theme + '/widgetContainer.ejs', {widget: widget}, function(err, html) {
				if( err ) throw err;

				var endTime = new Date().getTime();

				Logger.log('DEBUG', 'Widget ' + widgetClass + ' rendered in ' + (endTime - startTime) + ' msec');

				// Call the onReadyCallback with the result HTML
				onReadyCallback(html);

			}.bind(this));

		}.bind(this));

	};

};

// Export the class
module.exports = StatsToHTML;
