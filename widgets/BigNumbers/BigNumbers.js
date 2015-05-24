// Generic utils
var Utils = require('../../classes/Utils.js');

/**
 * Big Numbers widget
 *
 * @param {StatsAnalyzer} statsAnalyzer Instance of StatsAnalyzer that can be used for collecting statistical data
 * @param {Object} channelConfig The channel configuration
 * @constructor
 */
var BigNumbers = function(statsAnalyzer, channelConfig) {

	// Our ID and name, very important details
	var id = 'bigNumbers';
	var name = 'Big numbers';

	// The content HTML
	var contentHTML = null;

	// Our variables
	this.itemList = [];

	/**
	 * Initialize widget, collect data in a format useful for showing it
	 */
	this.initialize = function() {

		// Raw statistics
		var stats = statsAnalyzer.getStats();

		// Get the top question asking people
		var topQuestions = statsAnalyzer.nickObjectToArray( stats.questionsByNick ).sort( Utils.getArraySort('value') );
		if( topQuestions.length>=2 && topQuestions[0].value>0 ) {
			this.itemList.push({
				big: 'Is ' + topQuestions[0].nick + ' stupid or just asking too many questions? They asked ' + topQuestions[0].value + ' questions, which was ' + statsAnalyzer.getLinePct(topQuestions[0].nick, topQuestions[0].value) + '% of their lines.',
				small: topQuestions[1].nick + ' didn\'t know that much either. They asked ' + topQuestions[1].value + ' questions, which was ' + statsAnalyzer.getLinePct(topQuestions[1].nick, topQuestions[1].value) + '% of their lines.'
			});
		}

		// Top shouters
		var topShouts = statsAnalyzer.nickObjectToArray( stats.shoutsByNick ).sort( Utils.getArraySort('value') );
		if( topShouts.length>=2 && topShouts[0].value>0 ) {
			this.itemList.push({
				big: 'The loudest one was ' + topShouts[0].nick + ', who yelled ' + statsAnalyzer.getLinePct(topShouts[0].nick, topShouts[0].value) + '% of the time.',
				small: 'Another old yeller was ' + topShouts[1].nick + ', who shouted ' + statsAnalyzer.getLinePct(topShouts[1].nick, topShouts[1].value) + '% of the time.'
			});
		}

		// Top ALL CAPS
		var topCaps = statsAnalyzer.nickObjectToArray( stats.allCapsWordsByNick ).sort( Utils.getArraySort('value') );
		if( topCaps.length>=2 && topCaps[0].value>0 ) {
			this.itemList.push({
				big: 'It seems that ' + topCaps[0].nick + '\'s shift-key is hanging: ' + statsAnalyzer.getWordPct(topCaps[0].nick, topCaps[0].value) + '% of the time he/she wrote in UPPERCASE.',
				small: topCaps[1].nick + ' just forgot to deactivate his/her Caps-Lock. He/she wrote in UPPERCASE ' + statsAnalyzer.getWordPct(topCaps[1].nick, topCaps[1].value) + '% of the time.'
			});
		}

		// Top aggressive word nicks
		var topAggressors = statsAnalyzer.nickObjectToArray( stats.aggressiveWords ).sort( Utils.getArraySort('value') );
		if( topAggressors.length>=2 && topAggressors[0].value>0 ) {
			this.itemList.push({
				big: topAggressors[0].nick + ' is a very aggressive person. He/she attacked others ' + topAggressors[0].value + ' times.',
				small: topAggressors[1].nick + ' can\'t control their aggressions, either. He/she picked on others ' + topAggressors[1].value + ' times.'
			});
		}

		// TODO: Top victims

		// Top happy smiley nicks
		var topSmiles = statsAnalyzer.nickObjectToArray( stats.happySmileysByNick ).sort( Utils.getArraySort('value') );
		if( topSmiles.length>=2 && topSmiles[0].value>0 ) {
			this.itemList.push({
				big: topSmiles[0].nick + ' brings happiness to the world. ' + statsAnalyzer.getLinePct(topSmiles[0].nick, topSmiles[0].value) + '% of the lines contained smiling faces. :)',
				small: topSmiles[1].nick + ' isn\'t a sad person either, smiling ' + statsAnalyzer.getLinePct(topSmiles[1].nick, topSmiles[1].value) + '% of the time.'
			});
		}

		// Top unhappy smiley nicks
		var topSad = statsAnalyzer.nickObjectToArray( stats.unhappySmileysByNick ).sort( Utils.getArraySort('value') );
		if( topSad.length>=2 && topSad[0].value>0 ) {
			this.itemList.push({
				big: topSad[0].nick + ' seems to be sad at the moment: ' + statsAnalyzer.getLinePct(topSad[0].nick, topSad[0].value) + '% of the lines contained sad faces. :(',
				small: topSad[1].nick + ' is also a sad person, crying ' + statsAnalyzer.getLinePct(topSad[1].nick, topSad[1].value) + '% of the time.'
			});
		}

		// Longest lines
		var topLineLength = statsAnalyzer.nickObjectToArray( stats.lineLengthByNick ).sort( Utils.getArraySort('value') );
		if( topLineLength.length>=2 && topLineLength[0].value>0 ) {
			this.itemList.push({
				big: topLineLength[0].nick + ' wrote the longest lines, averaging ' + topLineLength[0].value.toFixed(1) + ' characters per line',
				small: 'The channel average was ' + stats.lineLength.toFixed(1) + ' characters per line.'
			});
		}

		// Shortest lines
		var shortLineLength = statsAnalyzer.nickObjectToArray( stats.lineLengthByNick ).sort( Utils.getArraySort('value') ).reverse();
		if( shortLineLength.length>=2 && shortLineLength[0].value>0 ) {
			this.itemList.push({
				big: shortLineLength[0].nick + ' wrote the shortest lines, averaging ' + topLineLength[0].value.toFixed(1) + ' characters per line.',
				small: shortLineLength[1].nick + ' was tight-lipped too, averaging ' + topLineLength[1].value.toFixed(1) + ' characters per line.'
			});
		}

		// Most words
		var topWords = statsAnalyzer.nickObjectToArray( stats.wordsByNick ).sort( Utils.getArraySort('value') );
		if( topWords.length>=2 && topWords[0].value>0 ) {
			this.itemList.push({
				big: topWords[0].nick + ' spoke a total of ' + topWords[0].value + ' words.',
				small: topWords[0].nick + '\'s faithful follower, ' + topWords[1].nick + ', didn\'t speak so much, only ' + topWords[1].value + ' words.'
			});
		}

		// Most words per line
		var topWordsPerLine = statsAnalyzer.nickObjectToArray( stats.wordsPerLineByNick ).sort( Utils.getArraySort('value') );
		if( topWordsPerLine.length>=2 && topWordsPerLine[0].value>0 ) {
			this.itemList.push({
				big: topWords[0].nick + ' wrote an average of ' + topWordsPerLine[0].value.toFixed(1) + ' words per line.',
				small: 'The channel average was ' + stats.averageWordsPerLine.toFixed(1) + ' words per line.'
			});
		}
	};


	/**
	 * Get our ID
	 */
	this.getId = function() {
		return id;
	};

	/**
	 * Get our name
	 */
	this.getName = function() {
		return name;
	};

	/**
	 * Get the content HTML
	 */
	this.getContent = function() {
		return contentHTML;
	};

	/**
	 * Get the JSON Data
	 */
	this.getJSON = function() {
		return this.itemList;
	};

	/**
	 * Set the content HTML
	 */
	this.setContent = function(html) {
		// Prevent setting it again once it's set
		if( contentHTML===null ) {
			contentHTML = html;
		} else {
			throw new Error('Trying to re-set widget content HTML');
		}
	};


	// Initialize our data
	this.initialize();
};

module.exports = BigNumbers;