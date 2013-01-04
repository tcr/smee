# smee, persistent local webhooks

Create a webhook locally which persists between script runs, with no configuration required:

```
var smee = require('smee');
smee.persistentHook(function (err, hook) {
  console.log('Your webhook URL:', hook.url); // same URL on next run
  hook.on('callback', function (json) {
    console.log('Received webhook:', json);
  });
});
```

Hook configuration is stored in a local .smeeconf file in your script directory and is different between scripts.

## Installation

    npm install smee

## Requirements

Install [localtunnel](https://github.com/progrium/localtunnel):

    pip install localtunnel

## License

MIT