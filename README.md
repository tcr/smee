# smee, persistent local webhooks

Create a webhook locally which persists between script runs, with no configuration required:

```
var smee = require('smee');
smee.persistentHook(function (err, hook) {
  console.log('Your webhook URL:', hook.url);
  hook.on('callback', function (json) {
    console.log('Received webhook:', json);
  });
});
```

## Installation

    npm install smee

## Requirements

Install [localtunnel](https://github.com/progrium/localtunnel):

    pip install localtunnel

## License

MIT