## SSO Login

Usage:

```js
var ssologin = require('lib/gallery/ssologin/1.0.0/ssologin');

ssologin.showDialog(
  // success callback
  function(res) {
    console.log('login ok', res);
  },
  // error feedback
  function(e) {
    console.log('error', res);
  }
);
```

## SSO Login Dialog [login] Listening

```js
var ssoChannel = require('lib/gallery/ssologin/1.0.0/channel');
ssoChannel.listen('login', function(response) {

    console.log('usr login');

    // do something ...

});

```
