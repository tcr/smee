var spawn = require('child_process').spawn
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;

var express = require('express')
  , nconf = require('nconf');

nconf.file('.smeeconf');

var PORT = 9009;

util.inherits(Hook, EventEmitter);

function Hook () {
}

exports.persistentHook = function (callback) {
  var hook = new Hook();
  var name = 'smee' + String(Math.random()).substr(2);

  if (!nconf.get('tunnel')) {
    nconf.set('tunnel', name);
    nconf.save(startServer);
  } else {
    name = nconf.get('tunnel');
    startServer();
  }

  function startServer () {
    var app = express();

    app.use(express.bodyParser());

    app.all('/', function (req, res) {
      if (res.json) {
        hook.emit('callback', res.json);
      }
      res.send('cool');
    })

    app.listen(PORT, function () {
      hook.local = 'http://localhost:' + PORT;
      startTunnel();
    });
  }

  function startTunnel () {
    var lt = spawn('localtunnel-beta', ['-n', name, PORT]);
    lt.stdout.on('data', function (data) {
      data = String(data);
      var look = 'is now accessible from ';
      if (data.indexOf(look) > -1) {
        hook.url = data.substr(data.indexOf(look) + look.length);
        callback(null, hook);
      } else {
        callback(data, null);
      }
    })
    lt.on('exit', function (code) {
      if (code) {
        callback(code, null);
      }
    })
  }
};