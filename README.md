# smee, persistent local webhooks

Create a webhook locally which persists between script runs, with no configuration required:

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

If your webhook call is being sent incorrectly from the server (as form or text data), set `json: true` in the options:

```javascript
smee.persistentHook({json: true}, function (err, hook) { ... })
```

## Installation

    npm install smee

## Requirements

Install [localtunnel](https://github.com/progrium/localtunnel):

    pip install localtunnel

## License

MIT