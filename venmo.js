var smee = require('smee')
  , crypto = require('crypto');

// Look for "Your Applications" -> "Venmo Receipts API" -> "Secret" 
// Your secret will be a string like this.
var SECRET = 'hbsG8nBmTTYnBZs2AKKQsYefs7NVyZUJ';

// Create our persistent webhook URL.
// Venmo sends the wrong Content-Type, so force with json: true
smee.persistentHook({
  json: true
}, function (err, hook) {
  if (err) return console.error('Error:', err);
  console.log('Your webhook URL:', hook.url);

  hook.on('callback', function (payload) {
    // Triggered each time the webhook receives a payload.
    // Here, we'll parse Venmo's signed response payload to
    // get the sweet, sweet receipt API within.

    // Split and decode signature and data.
    var parts = payload.payments.split('.');
    var sig = new Buffer(parts[0], 'base64').toString('hex');
    var data = JSON.parse(new Buffer(parts[1], 'base64').toString('utf8'))
    // Validate its signature.
    var expectedSig = crypto.createHmac('sha256', SECRET);
    expectedSig.update(parts[1]);
    expectedSig = expectedSig.digest('hex');
    if (sig != expectedSig) throw new Error('Invalid signature!')

    // Dump the JSON payload to console.
    console.log(data);
  });
});