[![Build Status](https://travis-ci.org/nolimits4web/Swiper.svg?branch=master)](https://travis-ci.org/nolimits4web/Swiper)
[![devDependency Status](https://david-dm.org/nolimits4web/swiper/dev-status.svg)](https://david-dm.org/nolimits4web/swiper#info=devDependencies)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=nolimits4web&url=https://github.com/nolimits4web/swiper/&title=Framework7&language=JavaScript&tags=github&category=software)

Swiper
==========

Swiper - is the free and most modern mobile touch slider with hardware accelerated transitions and amazing native behavior. It is intended to be used in mobile websites, mobile web apps, and mobile native/hybrid apps. Designed mostly for iOS, but also works great on latest Android, Windows Phone 8 and modern Desktop browsers

Swiper is not compatible with all platforms, it is a modern touch slider which is focused only on modern apps/platforms to bring the best experience and simplicity.

# Getting Started
  * [Getting Started Guide](http://www.idangero.us/swiper/get-started/)
  * [API](http://www.idangero.us/swiper/api/)
  * [Demos](http://www.idangero.us/swiper/demos/)
  * [Forum](http://www.idangero.us/swiper/forum/)

  ```js
  var Swiper = require('lib/plugins/swiper/3.1.2/swiper');

  var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    direction: 'vertical',
    loop: true,
    
    // If we need pagination
    pagination: '.swiper-pagination',
    
    // Navigation arrows
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    
    // And if we need scrollbar
    scrollbar: '.swiper-scrollbar',

    ...
  })
  ```

Swiper 2.x.x
==========

If you still using Swiper 2.x.x or you need old browsers support, you may find it in [Swiper2 Branch](https://github.com/nolimits4web/Swiper/tree/Swiper2)
* [Download Latest Swiper 2.7.6](https://github.com/nolimits4web/Swiper/archive/v2.7.6.zip)
* [Source Files](https://github.com/nolimits4web/Swiper/tree/Swiper2/src)
* [API](https://github.com/nolimits4web/Swiper/blob/Swiper2/API.md)
