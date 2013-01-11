# smee, persistent local webhooks

Create a webhook locally which persists between script runs, with no configuration required.

```javascript
var smee = require('smee');
smee.persistentHook(function (err, hook) {
  console.log('Your webhook URL:', hook.url); // this URL is the same each time the script is run
  hook.on('callback', function (json) {
    console.log('Received webhook:', json);
  });
});
```

Hook configuration is stored in a local `.smeeconf` file in your script directory and is different between scripts.

To use as middleware in a permanent server, just move to `smee.hook`:

```javascript
var app = express();
app.use('/webhook/', smee.hook(function (json) {
  console.log('Received webhook:', json);
})
```

## Options

If your webhook call is being sent incorrectly from the server (as form or text data), set `json: true` in the options:

```javascript
smee.persistentHook({json: true}, function (err, hook) { ... })
```

The default port is `9009`. If this is conflicting, change it by setting `port: ...` in the options.

## Installation

Install [localtunnel](https://github.com/progrium/localtunnel):

    pip install localtunnel

Then:

    npm install smee

## License & Credits

Smee is MIT licensed.

And if you're feeling good today, [donate to localtunnel](http://j.mp/donate-localtunnel) for being such an awesome project.