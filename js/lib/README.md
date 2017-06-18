# Library For FE Development

  **Less-logic components && librories**

## Integrate With Local Dev ENV

Ngnix 本地代理线上资源

  ```conf
  # s1.bbgstatic.com
  location / {
    add_header Timing-Allow-Origin "*";
    add_header Access-Control-Allow-Origin "*";
    try_files $uri $uri/ @proxy;
  }
  location @proxy {
    internal;
    proxy_set_header Host s1.bbgstatic.com;
    # proxy_pass http://124.232.133.243;
    proxy_pass http://10.200.51.142;
  }
  ```

## Extra Libraries CDN Mirror

### Bootstrap

  [Bootstrap v3.3.5](http://s3.bbgstatic.com/lib/bootstrap/3.3.5/css/bootstrap.min.css)

  <pre>
  http://s1.bbgstatic.com/lib/bootstrap/3.3.5/
  ├── js/
  ├── css/
  └── fonts/
  </pre>

  Getting started <http://getbootstrap.com/getting-started/#download>

  Usage:

  ```html
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="http://s3.bbgstatic.com/lib/bootstrap/3.3.5/css/bootstrap.min.css">
  <!-- Optional theme -->
  <link rel="stylesheet" href="http://s3.bbgstatic.com/lib/bootstrap/3.3.5/css/bootstrap-theme.min.css">
  ```

  ```js
  require.config({
    ...
    paths: {
      'bootstrap': '//s1.bbgstatic.com/lib/bootstrap/3.3.5/js/bootstrap.min',
      ...
    },
    shim: {
      'bootstrap': [ 'jquery' ]
      ...
    }
    ...
  });
  ```

### Font Awesome

  [Font Awesome 4.5.0](http://s3.bbgstatic.com/lib/font-awesome/4.5.0/css/font-awesome.css)

  Getting started <http://fontawesome.io/icons/>

  Usage:

  ```html
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="http://s3.bbgstatic.com/lib/font-awesome/4.5.0/css/font-awesome.css">
  ```

### Angularjs-1.4.3

  <http://s1.bbgstatic.com/lib/angularjs/1.4.3/> => <https://code.angularjs.org/1.4.3/>

  ```js
  require.config({
    ...
    paths: {
      ...
      'angular': '//s1.bbgstatic.com/lib/angularjs/1.4.3/angular.min',
      'angular-route': '//s1.bbgstatic.com/lib/angularjs/1.4.3/angular-route.min',
      'angular-sanitize': '//s1.bbgstatic.com/lib/angularjs/1.4.3/angular-sanitize.min'
      ...
    },
    shim: {
      'angular': { exports: 'angular' },
      'angular-sanitize': [ 'angular' ],
      'angular-route': [ 'angular' ]
      ...
    }
    ...
  });
  ```
