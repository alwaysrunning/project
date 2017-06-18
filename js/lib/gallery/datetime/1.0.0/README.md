## Datetime Example

```js
var DateTime = require('lib/gallery/datetime/1.0.0/datetime');

DateTime.getServerTime(function(ts) {
    console.log('Current server time: ' + new Date(ts));
});

```
