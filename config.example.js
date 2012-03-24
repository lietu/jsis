/*
 * Application configuration
 */
var config = {

	// Generate statistics for these channels:
	channels: [
		/*
		 * Mandatory configuration items: name, logFormat, logPath, destination
		 */
		{
			/**
			 * Name of the channel, will be used in the HTML template and messages
			 *
			 * @type {String}
			 */
			name: '#LameChannel',

			/**
			 * Which theme to use .. should be a name of one of the folders under "themes/"
			 * The default is surprisingly "default".
			 * @type {String}
			 */
			theme: 'default',

			/**
			 * Path to destination files, you should really use a full path here
			 *
			 * @type {String}
			 */
			destination: '/var/www/html/lamestats',

			/**
			 * What format are the log files in? .. this should correspond with one of the files in classes/LogReaders/*.js
			 *
			 * @type {String}
			 */
			logFormat: 'eggdrop',

			/**
			 * What file encoding are the log files in?
			 *
			 * If you comment out this, or enter UTF-8, nothing will be done to them, otherwise we'll ask Iconv to
			 * convert from this to UTF-8. List of supported encodings http://www.gnu.org/software/libiconv/
			 *
			 * @type {String}
			 */
			logEncoding: 'ASCII',

			/**
			 * Path to log files, you should really use a full path here
			 *
			 * @type {String}
			 */
			logPath: '/path/to/lamechannel/logs',

			/**
			 * Try and find log files recursively? Default: true
			 *
			 * @type {Boolean}
			 */
			recursive: true,

			/**
			 * RegExp that will be used to checked every log filename (it will include full path)
			 * E.g. to only parse files that end with "foo.log", you could use /foo\.log$/
			 * ... for help with regular expressions, check:
			 * http://www.visibone.com/regular-expressions/
			 * http://www.cheatography.com/davechild/cheat-sheets/regular-expressions/
			 *
			 * @type {RegExp}
			 */
			logFileFilter: /lamechannel\.log/,

			/**
			 * How many days of logs to parse at most
			 * Use "Infinity" to signify "everything"
			 *
			 * @type {RegExp}
			 */
			maxLogFiles: Infinity,

			/**
			 * Widgets to include, and in what order, comment out for default configuration (widgets/config.js)
			 * These are names of folders in widgets/*
			 *
			 * @type {Array}
			 */
			// widgets: [],

			/**
			 * HTML text to be inserted at the end of the <head> element, e.g. if you want Google Analytics on your stats
			 *
			 * @type {String}
			 */
			customHeadHtml: '',

			/**
			 * How many lines/actions in a row does one need to say before it being considered "going solo"?
			 * @type {Number}
			 */
			soloLength: 5,

			/**
			 * Space separated list of words to be considered foul
			 * Setting this will override the whole list of defaults
			 *
			 * @type {String}
			 */
			// foulWords: 'fuck shit',

			/**
			 * Space separated list of words to be considered aggressive
			 * Setting this will override the whole list of defaults
			 *
			 * @type {String}
			 */
			// aggressiveWords: 'slaps spanks',

			/**
			 * Space separated list of smileys to consider happy
			 * Setting this will override the whole list of defaults
			 *
			 * @type {String}
			 */
			// happySmileys: ':) ;)',

			/**
			 * Space separated list of smileys to consider unhappy
			 * Setting this will override the whole list of defaults
			 *
			 * @type {String}
			 */
			// unhappySmileys: ':( ;( :/ ;/',

			/**
			 * List of user configurations, from nickname to show, to an user configuration object.
			 * The user configuration object can contain an array of aliases, these can be space separated strings with wildcards (* and ?), or JavaScript RegExp objects (these will be tested against the lowercase nickname)
			 * It can also contain an ignore boolean, a pictureUrl to be used (make sure it works based on wherever you're storing the pages, absolute URLs are pretty safe), a link to be associated with the user nick & pic, and sex to show (male, female, bot, unknown), all settings are optional
			 *
			 * E.g. { foo: {
			 *    aliases: ['foo* foobar', /fooba[rz]/],
			 *    ignore: false,
			 *    pictureUrl: 'http://example.com/foo.jpg',
			 *    link: 'http://example.com',
			 *    sex: 'male'
			 *  } }
			 * ... default is no aliases, don't ignore, no picture, no link, sex: unknown
			 *
			 * @type {Object}
			 */
			userConfig: {
			}
		}
	],

	/* Logging settings */
	log: {

		// What to log and where, each log level (DEBUG, INFO, MESSAGE, WARNING, ERROR, CRITICAL) can have their own array of destinations
		// Use an empty array to discard immediately
		// Special keywords 'STDOUT' and 'STDERR' work as one could expect from such special keywords

		// 'DEBUG': ['STDOUT'],
		// 'INFO': ['STDOUT'],
		'MESSAGE': ['STDOUT'],
		'WARNING': ['errors.log', 'STDERR'],
		'ERROR': ['errors.log', 'STDERR'],
		'CRITICAL': ['errors.log', 'STDERR']

	}
};

// Export the config
module.exports = config;
