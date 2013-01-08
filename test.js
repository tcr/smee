var smee = require('./');

smee.persistentHook({json: true}, function (err, hook) {
  if (err) return console.error('Error:', err);

  console.log('Your webhook URL:', hook.url);
  hook.on('callback', function (json) {
    console.log('Received webhook:', json);
  });
});