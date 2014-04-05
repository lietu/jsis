var config = {
	channels: [
		{
			name: '#LameChannel',
			theme: 'default',
			destination: '/tmp/jivy/destination',
			logFormat: 'eggdrop',
			logEncoding: 'ASCII',
			logPath: '/tmp/jivy/source',
			logFileFilter: /lamechannel\.log/,
			recursive: true,
			maxLogFiles: Infinity,
			customHeadHtml: '',
			soloLength: 5,
			wordMinLength: 3,

			userConfig: {
			}
		}
	],

	log: {
		'DEBUG': ['STDOUT'],
		'INFO': ['STDOUT'],
		'MESSAGE': ['STDOUT'],
		'WARNING': ['errors.log', 'STDERR'],
		'ERROR': ['errors.log', 'STDERR'],
		'CRITICAL': ['errors.log', 'STDERR']
	}
};

module.exports = config;
