/*
 * Simple multi-channel config .. Read more about the settings from config.example.js
 */
var config = {
	channels: [
		{
			name: '#LameChannel',
			destination: '/var/www/html/lamestats',
			logFormat: 'eggdrop',
			logPath: '/path/to/lamechannel/logs'
		},
        {
            name: "#AnotherLamePlace",
            destination: '/var/www/html/anotherlameplace',
            logFormat: 'irssi',
            logPath: '/path/to/anotherlameplace/logs'
        }
	],

	log: {
		'MESSAGE': ['STDOUT'],
		'WARNING': ['errors.log', 'STDERR'],
		'ERROR': ['errors.log', 'STDERR'],
		'CRITICAL': ['errors.log', 'STDERR']
	}
};

// Export the config
module.exports = config;
