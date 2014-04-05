var config = {
	channels: [
		{
			name: '#example',
			theme: 'default',
			destination: 'test_files/destination',
			logFormat: 'eggdrop',
			logEncoding: 'ASCII',
			logPath: 'test_files/eggdrop',
			logFileFilter: /test\.log\.[0-9]{4}-[0-9]{2}-[0-9]{2}/,
			recursive: true,
			maxLogFiles: Infinity,

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
