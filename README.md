ZoomGallery Documentation
=========
ZoomGallery is a small and easy to use JS library to make responsive images galleries.

The demo is available here: http://zoomgallery.deflotte.fr/

Requirement
------------
ZoomGallery require jQuery 1.8.2

To eneable swipe event, hammer.js 0.6.2 is required

Get Started
------------

Here is the minimal html code to use ZoomGallery


    <html>
        <head>
            <link rel="stylesheet" href="zoomgallery.css" type="text/css" />
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript" src="zoomgallery.js"></script>
            <script type="text/javascript">
                $(document).ready(function() {
                    $('.zoomgallery').zoomgallery();
                });
            </script>
        </head>
        <body>
            <a href="gallery/img1.jpg" class="zoomgallery">
                <img src="thumbnail/img1.jpg" title="Image description" />
            </a>
        </body>
    </html>


Options
------------
ZoomGaller allow these next options
 - navbar (boolean(true)): Display navigation bar
 - titlebar (boolean(true)): Display title bar
 - galleryMod (boolean(true)): Enable gallery mod
 - infinite (boolean(true)): Images can be scrolled to infinity
 - windowClassName (string('zoomWindow')): Class used for the window
 - limiterClassName (string('limiter')): Class used for the blue shadow when dragging image in mobile mod
 - navbarClassName (string('navbar')): Class used for the navbar
 - titlebarClassName (string('titlebar')): Class used for the title bar
 - previousButtonClassName (string('prev')): Class used for previous button in the navbar
 - nextButtonClassName (string('next')): Class used for next button in the navbar
 - mobileZoomClassName (string('mobilezoom')): Class add to window when navbar is activated
 - animationDuration (float(0.6)): Animation duration in second
 - swipeEvent (boolean(true)): Allow swipe event to run gallery. This feature require hammer.js (http://eightmedia.github.com/hammer.js/).
 - mobileZoom (array({height: 800, width: 600}): Allow a specific zoom for small device. To disable this feature, set  this attribute to boolean(false).
 
Customization
------------
ZoomGallery is fully customizable by editng the CSS zoomgallery.css


Compatibility
------------
ZoomGallery is fully compatible with Firefox (16 and more), Chome (18 and more), Chrome for Android, and Firefox for Android. I do not try on Opera and Safari, but there is no reason that ZoomGallery does not work with them.

With IE 8 and less the css3 transitions will not work. Transparency and rounded border will not work with IE under version 9 (not include).


Version
-

0.6


License
-

GPL

  [Maxence de Flotte]: http://tech.deflotte.fr/
  [@madef_]: http://twitter.com/madef_
  [demo]: http://zoomgallery.deflotte.fr
