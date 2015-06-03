let app = require('app'),
    BrowserWindow = require('browser-window'),
    debug = require('debug');

let log = debug('main:main-window');

let mainWindow;

app.on('window-all-closed', function() {
  log('window-all-closed');

  // quit if platform is not OS X
  if (!/darwin/i.test(process.platform)) {
    log('platform is not OS X');

    app.quit();
  }
});

app.on('ready', function() {
  log('ready');

  // window options
  let options = {
    'center': true,
    'min-height': 400,
    'min-width': 300,
    'height': 400,
    'width': 300,
  };

  log(options);

  // create main window
  mainWindow = new BrowserWindow(options);
  mainWindow.on('closed', function() {
    // destroy main window reference
    mainWindow = null;
  });

  log('set menu');

  // set application menu
  require('./menu-items');

  log('loadUrl', `file://${__dirname}/../renderer/index.html`);

  // load main page
  mainWindow.loadUrl(`file://${__dirname}/../renderer/index.html`);
});
