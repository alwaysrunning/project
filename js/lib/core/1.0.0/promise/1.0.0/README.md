<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>
# Promise

Lightweight ES6 Promise polyfill for the browser and node. Adheres closely to the spec. It is a perfect polyfill IE, Firefox or any other browser that does not support native promises.

This implementation is based on [then/promise](https://github.com/then/promise). It has been changed to use the prototype for performance and memory reasons.

For API information about Promises, please check out this article [HTML5Rocks article](http://www.html5rocks.com/en/tutorials/es6/promises/).


## Browser Support

IE8+, Chrome, Firefox, IOS 4+, Safari 5+, Opera


## Simple Usage

```js
var Promise = require('promise');

var prom = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve('Stuff worked!');
  }  else {
    reject(new Error('It broke'));
  }
});

// Do something when async done
prom.then(function() {
  ...
});
```

## Unhandled Rejections

promise-polyfill will warn you about possibly unhandled rejections. It will show a console warning if a Promise is rejected, but no `.catch` is used. You can turn off this behavior by setting `Promise._setUnhandledRejectionFn(<rejectError>)`.
If you would like to disable unhandled rejections. Use a noop like below.

```js
Promise._setUnhandledRejectionFn(function(rejectError) {});
```

## License

MIT
