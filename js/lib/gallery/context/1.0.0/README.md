## Context module

Page context management. Helper for global config data apis access etc,.

### getConf(key [ , defval, context ])

Get global config by a specificd key

```js
$PAGE_DATA['foo'] = {
    params: 'FOO_PARAMS'
};

context.getConf('foo.params')
// => FOO_PARAMS
```

### resolveUrl(from, to)

Resolve APIs prefix from `$PAGE_DATA['paths']`

```js
// Test cfg
(global.$PAGE_DATA||(global.$PAGE_DATA={})).paths = {
    "@": "yunhou.com",
    "api.mall": "//api.mall.yunhou.com",
    "cart": "//cart.yunhou.com",
};

var context = require('./context');
var svcFooGet = context.resolveUrl('api.mall', '/foo/path/get?ac=doit')
console.log(svcFooGet);
// => //api.mall.yunhou.com/foo/path/get?ac=doit
```
