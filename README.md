ZoomGallery Documentation
=========
ZoomGallery is a small and easy to use JS library to make responsive images gallerie.  

Requirement
------------
ZoomGallery require jQuery 1.8.2

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
ZoomGaller allow this next options
 - navbar (boolean(true)): Display navigation bar
 - titlebar (boolean(true)): Display title bar
 - galleryMod (boolean(true)): Enable gallery mod
 - infinite (boolean(true)): Images can be scrolled to infinity
 - windowClassName (string('zoomWindow')): Class used for the window
 - animationDuration (float(0.6)): Animation duration in second

Version
-

0.1


License
-

GPL

  [Maxence de Flotte]: http://tech.deflotte.fr/
  [@madef_]: http://twitter.com/madef_
  [demo]: http://zoomgallery.deflotte.fr
