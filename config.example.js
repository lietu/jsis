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
			 * If your logs are not from the same timezone as the machine you're generating stats, setting this
			 * will help you get the expected results. For timezone adjustment, also set statsTimezone.
			 *
			 * Format: +HH:MM or -HH:MM as offset from GMT, null to use server timezone (default)
			 * E.g.: +03:00 or -07:00
			 *
			 * @type {String}
			 */
			//logTimezone: '+03:00',

			/**
			 * Path to log files, you should really use a full path here
			 *
			 * @type {String}
			 */
			logPath: '/path/to/lamechannel/logs',

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
			 * Try and find log files recursively? Default: true
			 *
			 * @type {Boolean}
			 */
			recursive: true,

			/**
			 * How many days of logs to parse at most
			 * Use "Infinity" to signify "everything"
			 *
			 * @type {RegExp}
			 */
			maxLogFiles: Infinity,

			/**
			 * If you want to render the stats in a different timezone than the server is at, set this to the
			 * timezone you want to render in. Also you might want to make sure logTimezone is correct.
			 *
			 * Format: +HH:MM or -HH:MM as offset from GMT, null to use server timezone (default)
			 * E.g.: +03:00 or -07:00
			 *
			 * @type {String}
			 */
			//statsTimezone: '+00:00',

			/**
			 * What text to show as being the timezone, in case you don't want to show "GMT-07:00"
			 *
			 * @type {String}
			 */
			//statsTimezoneText: 'GMT',

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
			 * Minimum length of a word, before it is considered a word for the stats displaying per-word stats.
			 * This will not affect the users' "words", "words per line", etc. stats.
			 *
			 * Just set to 1 to disable .. however you'll end up with a lot of "I", "a", "to", "in", etc.
			 *
			 * @type {Number}
			 */
			wordMinLength: 3,

			/**
			 * Ignore these words for the stats displaying per-word stats.
			 * This will not affect the users' "words", "words per line", etc. stats.
			 *
			 * Just set to null to disable, otherwise give a space separated list of words to ignore.
			 *
			 * @type {String}
			 */
			//ignoreWords: 'I a it to in of an',

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
