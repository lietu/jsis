// Make running from cron etc. with relative path easier
process.chdir(__dirname);

var jsis = require('./classes/JSIS.js');
jsis.start();
