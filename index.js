var spawn = require('child_process').spawn
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;

var express = require('express')
  , nconf = require('nconf');

nconf.file('.smeeconf');

util.inherits(Hook, EventEmitter);

function Hook () {
}

exports.hook = function (opts, callback) {
  if (!callback) callback = opts, opts = {};

  return function (req, res, next) {
    if (req.method != 'POST') {
      return next();
    }
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
      data += chunk;
    });
    req.on('end', function() {
      callback(opts.json ? JSON.parse(data) : req.body, req);
      res.send('');
    });

    // Parse form or JSON body.
    express.bodyParser()(req, res, function () { });
  };
};

exports.persistentHook = function (opts, callback) {
  if (!callback) callback = opts, opts = {};

  var hook = new Hook();
  var name = 'smee' + String(Math.random()).substr(2);
  var port = (opts.PORT || 9009);

  if (!nconf.get('tunnel')) {
    nconf.set('tunnel', name);
    nconf.save(startServer);
  } else {
    name = nconf.get('tunnel');
    startServer();
  }

  function startServer () {
    var app = express();

    app.use('/', exports.hook(opts, hook.emit.bind(hook, 'callback')));

    app.listen(port, function () {
      hook.local = 'http://localhost:' + port;
      startTunnel();
    });
  }

  function clone (arg) {
    return JSON.parse(JSON.stringify(arg));
  }

  function augment (a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a;
  }

  function startTunnel () {
    var lt = spawn('localtunnel-beta', ['-n', name, port], {
      env: augment(clone(process.env), {'PYTHONUNBUFFERED': 'x'})
    });
    lt.stdout.on('data', function (data) {
      data = String(data);
      var look = 'is now accessible from ';
      if (data.indexOf(look) > -1) {
        hook.url = data.substr(data.indexOf(look) + look.length).replace(/^\s+|\s+$/g, '');
        callback(null, hook);
      } else {
        callback(data, null);
      }
    });

    lt.on('exit', function (code) {
      if (code) {
        callback(code, null);
      }
    })
  }
};