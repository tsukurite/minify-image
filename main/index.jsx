// install sourcemap support
require('source-map-support/register');

// cd
process.chdir(`${__dirname}/../`);

// register messages
require('./optimize-image');

// create main window
require('./main-window');
