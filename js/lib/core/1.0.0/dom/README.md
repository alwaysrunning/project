DOM utilities.

## dataset

> Parse DOM dataset attributes to js k/v object. Returns a associative map.
>
> NOTE
> ====
> The attribute name must be prefix `data-`, and case-sensitive transform to
> camelCase name.  The attribute value will be convert to a JavaScript value (this
> includes booleans, numbers, objects, arrays, and null)

```js
// <div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth="2000-01-01" data-json-data="{&quot;foo&quot;:1,&quot;bar&quot;:[1,2,3]}">John Doe</div>

var dataset = require('lib/core/1.0.0/dom/dataset')

var data = dataset('#user')
// => {"id":1234567890,"user":"johndoe","dateOfBirth":"","jsonData":{"foo":1,"bar":[1,2,3]}}
```

## build

```js
var build = require('lib/core/1.0.0/dom/build')
```
