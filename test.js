var smee = require('./');

smee.persistentHook(function (err, hook) {
  console.log('Your webhook URL:', hook.url);
  hook.on('callback', function (json) {
    console.log('Received webhook:', json);
  });
});