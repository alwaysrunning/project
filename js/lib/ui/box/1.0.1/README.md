## Box usage example

Installation

```js
var box = require('lib/ui/box/1.0.1/box');
```

### IBox Options

```js
// Trigger focus when popup shown
autofocus: true,

// Use absolute: fixed for popup layout
fixed: false,

// Defaults to aligning the element's top-left corner to the target's bottom-left corner ("bl")
// For details see #{.alignTo()}
align: 'bl',

// Base class name for container element
className: '',

// Enable disappear view when tap out of the dialog
clickBlankToHide: false,

// Optional set the popup layer host container (Defaults to body)
appendTo: 'body',

// Auto destroy popup instance (call #destroy when popup hidden)
autoRelease: false,

// Template html for popup constructor
html: '',

// Show layer with a overlayer
modal: false,

// Optional set animate type for **#show** and **#hide**
showWithAni: 'bounceIn:fast',
hideWithAni: 'bounceOut:fast'
```

### Generic APIs (methods and events)

Methods:

```
`#.action()`
`#.button()`
`#.show()`
`#.hide()`
```

Events:

```
`render`
`show`
`shown`
`hide`
`hidden`
`destroy`
```

### \# alert()

```js
box.alert('A plain text message!');
```

### \# confirm()

```js
box.confirm(
  text /* {String} */,
  callback /* {Function} */,
  options /* {HTMLElement|Object} */
);
```

Simple usage

```js
box.confirm('This page will be reload, sure?', function(result)  {
  if (result) {
    location.reload();
  } else {
    box.tips('reload cancelled');
  }
});
```

Confirm with customize options

```js

// shortcut with sender hook
box.confirm('sure?', function() {}, $('#btn')[0]);

// with complex options
box.confirm('sure?', function() {}, {
  sender: $('#btn')[0],
  className: 'custom-confirm'
  ....
});
```

### \# Bubble tips (error, success, info)

```js
box.bubble(text [, options [, element ] ]);
```

some mutation api derives:

```
#.bubble(...) - show a plain text without icon.
#.error(...) - show error message with icon
#.suceess(...)
#.info(...)
#.warn(...)
```

### \# show loading spinner

```js
// show loading
var spinner = box.loading('Loading, please wait for a minutes...')
setTimeout(function() { // use settime to simulate a async process
  // hide
  spinner.hide(true); // use `TRUE` as a first parameter to destroy it when hidden.
}, 1000);
```

### \# Buildin template with customize button

```js
box.create({
  ...

  // The first button will autofocus by the defaults
  button: [
    { text: 'Button1', fn: function(e) { ... } },
    { text: 'Button2', fn: function(e) { ... } }
  ],

  ...
})
```

### \# Cutomize box with template html struct

```js
var tplBox = [
  '<div class="inner">',
    '<div class="close" action-type="close">x</div>',
    '<div class="text">test layer by customize template html.</div>',
    '<div class="func">',
      '<a class="x-button x-button-light" action-type="ok">OK</a>',
    '</div>',
  '</div>'
].join('')

var layer = box.create(tplBox, {
  className: "ui-popup",
});

layer.action({
  ok: function() { box.ok('i am ok'); },
  cancel: function() { box.bubble('layer cancelled'); }
})

layer.show();
```

## For more online demo

[demo](http://10.200.51.142:8080/html/demo/test.html#0) - [source code](http://s1.bbgstatic.com/test/js/module/demo/box.js)
