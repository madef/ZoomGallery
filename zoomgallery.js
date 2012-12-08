/*
Copyright (C) 2012 de Flotte Maxence

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

/*
 * @version 0.6
 */

jQuery.fn.zoomgallery = function(options) {
	// Defaults vars
	var defaults = {
		navbar: true,
		titlebar: true,
		galleryMod: true,
		infinite: true,
		windowClassName: 'zoomWindow',
		limiterClassName: 'limiter',
		navbarClassName: 'navbar',
		titleClassName: 'titlebar',
		previousButtonClassName: 'prev',
		nextButtonClassName: 'next',
		mobileZoomClassName: 'mobilezoom',
		animationDuration: 0.6,
		swipeEvent: true,
		mobileZoom: {height: 500, width: 500}
	};
	// Extend our default options with those provided.
	var opts = jQuery.extend(defaults, options);
	
	var currentImg = 0; // Img curently view for gallery mode
	var gallery = jQuery(this);
	
	var zoomId = 0;
	// Add windows
	jQuery(this).each(function() {
		// Set a zoomId
		jQuery(this).attr('zoomId', zoomId);
		var img = jQuery(this);
		
		
		var win = jQuery('<div></div>')
			.addClass(opts.windowClassName)
			.css({
				display: 'none',
				position: 'absolute',
				overflow: 'hidden',
				top: 0,
				left: 0,
				width: 0,
				height: 0
			})
			.attr('id', opts.windowClassName + zoomId)
			.append(jQuery('<img />')
				.css('width', '100%')
				.css('height', '100%')
				.click(function() {
					if (jQuery(this).parent().get(0).dragging) {
						return false;
					}
					hideWindow(img);
					return false;
				})
			)
			.append(
				jQuery('<div class="' + opts.limiterClassName + '"></div>')
					.css3('user-select', 'none')
					.css3('user-drag', 'none')
					.click(function() {
						jQuery(this).parent().find('img').click();
					})
			);
		
		if (opts.navbar) {
			win.append(
				jQuery('<div class="' + opts.navbarClassName + '"></div>')
					.append(
						jQuery('<div class="' + opts.previousButtonClassName + '"></div>')
							.click(function() { prev(); })
					 )
					.append(
						jQuery('<div class="' + opts.nextButtonClassName + '"></div>')
							.click(function() { next(); })
					 )
					
			);
		}
		if (opts.titlebar) {
			win.append(
				jQuery('<div class="' + opts.titlebarClassName + '"></div>')
					.html(img.find('img').attr('title'))
			);
		}
		
		jQuery('body').append(win);
		
		// Adding swipe event
		if (opts.swipeEvent && opts.galleryMod) {
			win.find('img').css3('user-select', 'none');
			win.find('img').css3('user-drag', 'none');
			win.find('img').on('dragstart', function() {
				return false;
			});
			win
				.hammer({
				})
 				.on('dragstart', function(ev) {
					// Mobile Zoom, dragging = scrolling image
					if ('dragstart', this.mobileZoom) {
						this.position = win.find('img').position();
					} else { // dragging = changing image
						if ((ev.angle < 90 ||ev.angle > 270) && ev.angle > 0 || (ev.angle > -90 ||ev.angle < -270) && ev.angle < 0) {
							next();
						} else {
							prev();
						}
						return false;
					}
				})
 				.on('drag', function(ev) {
					this.dragging = true;
					if (this.dragStarted) {
						return false;
					}
					var position = this.position;
					
					if (this.mobileZoom) {
						var top = position.top + ev.distanceY;
						var left = position.left + ev.distanceX;
						if (top > 0) {
							top = 0;
						} else if (top < - jQuery(this).find('img').height() + jQuery(this).height()) {
							top = - jQuery(this).find('img').height() + jQuery(this).height();
						}
						
						if (left > 0) {
							if (opts.galleryMod) {
								if ((left) /  jQuery(this).find('img').width() > 0.2) {
									this.dragStarted = true;
									prev();
								}
								jQuery(this).find('.' + opts.limiterClassName).css({
									boxShadow: (left / 6) + 'px 0 57px ' + jQuery(this).find('.' + opts.limiterClassName).css('border-left-color'),
									left: 'auto',
									right: '100%'
								});
							}
							left = 0;
						} else if (left < - jQuery(this).find('img').width() + jQuery(this).width()) {
							if (opts.galleryMod) {
								if ((left + jQuery(this).find('img').width() - jQuery(this).width()) /  jQuery(this).find('img').width() < -0.2) {
									this.dragStarted = true;
									next();
								}
								jQuery(this).find('.' + opts.limiterClassName).css({
									boxShadow: (left + jQuery(this).find('img').width() - jQuery(this).width()) / 6 + 'px 0 57px ' + jQuery(this).find('.' + opts.limiterClassName).css('border-left-color'),
									left: '100%',
									right: 'auto'
								});
								left = jQuery(this).find('img').width() - jQuery(this).width() + (left + jQuery(this).find('img').width() - jQuery(this).width()) / 6;
							}
							left = - jQuery(this).find('img').width() + jQuery(this).width();
						}
						
						jQuery(this).find('img').css({
							top: top,
							left: left
						});
					}
					return false;
				})
 				.on('dragend', function(ev) {
					var it = this;
					jQuery(this).find('.' + opts.limiterClassName).css({
						boxShadow: '0 0 0 ' + jQuery(this).find('.' + opts.limiterClassName).css('border-left-color'),
						left: '100%'
					});
					setTimeout(function() {
						it.dragging = false;
						it.dragStarted = false;
					}, 100);
					return false;
				})
 				.on('swipe', function(ev) {
					if (win.get(0).mobileZoom) {
						return false;
					}
					if ((ev.angle < 90 ||ev.angle > 270) && ev.angle > 0 || (ev.angle > -90 ||ev.angle < -270) && ev.angle < 0) {
						next();
					} else {
						prev();
					}
				});
		}
		
		zoomId++
	});
	
	var resizeWindow = function(win) {
		var win = jQuery(win).get(0);
		if (!jQuery(win).is(':visible')) {
			return;
		}
		
		var windowHeight = jQuery(window).height();
		var windowWidth = jQuery(window).width();
		
		var wMarge = jQuery(win).outerWidth(true) - jQuery(win).outerWidth();
		var hMarge = jQuery(win).outerHeight(true) - jQuery(win).outerHeight();
		
		var wRate = (jQuery(win).find('img').naturalWidth() + wMarge) / windowWidth;
		var hRate = (jQuery(win).find('img').naturalHeight() + hMarge) / windowHeight;
		
		// The devise is a mobile (or have a small resolution)? Use specific zoom
		if (opts.mobileZoom !== false
			&& opts.mobileZoom.height
			&& opts.mobileZoom.width
			&& (
				windowHeight < opts.mobileZoom.height
				|| windowWidth < opts.mobileZoom.width
		)) {
			if (wRate > 1 || hRate > 1) {
				win.mobileZoom = true;
				win.dragging = false;
				jQuery(win).addClass(opts.mobileZoomClassName);
				jQuery(win).css3('transition-duration', '0s');
				if (wRate > hRate) {
					var width = (jQuery(win).find('img').naturalWidth() + wMarge) / hRate;
					var left = - (width - windowWidth) / 2;
					jQuery(win).find('img').css({
						height: windowHeight + 'px',
						width: width + 'px',
						left: left,
						top: 0
					});
				} else {
					jQuery(win).addClass(opts.mobileZoomClassName);
					var height = (jQuery(win).find('img').naturalHeight()) / wRate - hMarge;
					var top = - (height - windowHeight) / 2;
					jQuery(win).find('img').css({
						height: height + 'px',
						width: windowWidth + 'px',
						left: 0,
						top: top
					});
				}
			} else {
				win.mobileZoom = false;
				jQuery(win).removeClass(opts.mobileZoomClassName);
				jQuery(win).css3('transition-duration', opts.animationDuration + 's');
				
				jQuery(win).find('img').css({
					height: '100%',
					width: '100%',
					top: '0',
					left: '0'
				});
			
				jQuery(win).css({
					height: jQuery(win).find('img').naturalHeight() + 'px',
					width: jQuery(win).find('img').naturalWidth() + 'px',
					top: (windowHeight - jQuery(win).find('img').naturalHeight()) / 2 + jQuery(document).scrollTop() + 'px',
					left: (windowWidth - jQuery(win).find('img').naturalWidth()) / 2 + jQuery(document).scrollLeft() + 'px'
				});
			}
		} else {
			win.mobileZoom = false;
			jQuery(win).removeClass(opts.mobileZoomClassName);
			jQuery(win).css3('transition-duration', opts.animationDuration + 's');
			
			jQuery(win).find('img').css({
				height: '100%',
				width: '100%',
				top: '0',
				left: '0'
			});
			
			win.mobileZoom = false;
			if (wRate > 1 || hRate > 1) {
				if (wRate > hRate) {
					jQuery(win).css({
						width: windowWidth - wMarge + 'px',
						height: (jQuery(win).find('img').naturalHeight() + hMarge) / wRate - hMarge + 'px',
						top: (windowHeight - jQuery(win).find('img').naturalHeight() / wRate) / 2 - hMarge / 2 + jQuery(document).scrollTop() + 'px',
						left: jQuery(document).scrollLeft()
					});
				} else {
					jQuery(win).css({
						height: windowHeight - hMarge + 'px',
						width: (jQuery(win).find('img').naturalWidth() + wMarge) / hRate - wMarge + 'px',
						left: (windowWidth - jQuery(win).find('img').naturalWidth() / hRate) / 2 - wMarge / 2 + jQuery(document).scrollLeft() + 'px',
						top: jQuery(document).scrollTop()
					});
				}
			} else {
				jQuery(win).css({
					height: jQuery(win).find('img').naturalHeight() + 'px',
					width: jQuery(win).find('img').naturalWidth() + 'px',
					top: (windowHeight - jQuery(win).find('img').naturalHeight()) / 2 + jQuery(document).scrollTop() + 'px',
					left: (windowWidth - jQuery(win).find('img').naturalWidth()) / 2 + jQuery(document).scrollLeft() + 'px'
				});
			}
		}
	}
	
	var load = function(elm, callback) {
		var id = elm.attr('zoomId');
		elm.addClass('loading');
		jQuery('#' + opts.windowClassName + id + ' img').attr('src', elm.attr('href'));
		jQuery('#' + opts.windowClassName + id + ' img').load(function() {
				var win = jQuery(this).parent();
				elm.removeClass('loading');
				resizeWindow(win);
				
				if (callback) {
					callback(elm);
				}
				
				var it = jQuery(this).parent();
				jQuery(window).resize(function() {
					resizeWindow(win);
				});
		});
	}
	
	var displayWindow = function(elm) {
		if (!jQuery('#' + opts.windowClassName + elm.attr('zoomId') + ' img').attr('src')) {
			load(elm, displayWindow);
			return;
		}
		
		if (currentImg != elm.attr('zoomId')) {
			hideWindow(jQuery(gallery[currentImg]));
		}
		var win = jQuery('#' + opts.windowClassName + elm.attr('zoomId'));
		var wMarge = jQuery(win).outerWidth(true) - jQuery(win).outerWidth();
		var hMarge = jQuery(win).outerHeight(true) - jQuery(win).outerHeight();
		
		var minWMarge = jQuery(elm).outerWidth(true) - jQuery(elm).outerWidth();
		var minHMarge = jQuery(elm).outerHeight(true) - jQuery(elm).outerHeight();
		
		var bodyWMarge = jQuery('body').outerWidth(true) - jQuery('body').outerWidth();
		var bodyHMarge = jQuery('body').outerHeight(true) - jQuery('body').outerHeight();
		currentImg = elm.attr('zoomId');
		
		if (jQuery('body').css('position') != 'static') {
			bodyWMarge = 0;
			bodyHMarge = 0;
		}
		
		win.css3('transition-duration', '0s');
		win.removeClass('expended');
		win.addClass('reset');
		win.css({
			left: elm.offset().left - wMarge / 2 - jQuery('body').offset().left + bodyWMarge / 2,
			top: elm.offset().top - hMarge / 2 - jQuery('body').offset().top + bodyHMarge / 2,
			width: elm.width(),
			height: elm.height(),
			zIndex: 1
		});
		win.show();
		elm.css('visibility', 'hidden');
		win.removeClass('reset');
		resizeWindow(win);
		setTimeout(function() {
			win.addClass('expended');
		}, opts.animationDuration * 1000)
	}
	
	var hideWindow = function(elm) {
		var win = jQuery('#' + opts.windowClassName + elm.attr('zoomId'));
		var wMarge = jQuery(win).outerWidth(true) - jQuery(win).outerWidth();
		var hMarge = jQuery(win).outerHeight(true) - jQuery(win).outerHeight();
		
		var minWMarge = jQuery(elm).outerWidth(true) - jQuery(elm).outerWidth();
		var minHMarge = jQuery(elm).outerHeight(true) - jQuery(elm).outerHeight();
		
		var bodyWMarge = jQuery('body').outerWidth(true) - jQuery('body').outerWidth();
		var bodyHMarge = jQuery('body').outerHeight(true) - jQuery('body').outerHeight();
		
		if (jQuery('body').css('position') != 'static') {
			bodyWMarge = 0;
			bodyHMarge = 0;
		}
		win.css({
			left: elm.offset().left - wMarge / 2 - jQuery('body').offset().left + bodyWMarge / 2,
			top: elm.offset().top - hMarge / 2 - jQuery('body').offset().top + bodyHMarge / 2,
			width: elm.width(),
			height: elm.height(),
			zIndex: 0
		});
		
		win.addClass('reset');
		win.removeClass('expended');
		
		if (jQuery(win).hasClass(opts.mobileZoomClassName)) {
			var duration = 0;
		} else {
			var duration = opts.animationDuration;
		}
		
		setTimeout(function() {
			elm.css('visibility', 'visible');
			win.hide();
		}, duration * 1000)
	}
	
	var next = function() {
		if (!opts.galleryMod) {
			return;
		}
		newImg = parseInt(currentImg) + 1;
		if (newImg >= gallery.length) {
			if (!opts.infinite) {
				return;
			}
			newImg = 0;
		}
		displayWindow(jQuery(gallery[newImg]));
	}
	var prev = function() {
		if (!opts.galleryMod) {
			return;
		}
		newImg = parseInt(currentImg) - 1;
		if (newImg < 0) {
			if (!opts.infinite) {
				return;
			}
			newImg = gallery.length - 1;
		}
		displayWindow(jQuery(gallery[newImg]));
	}
	
	jQuery(this).click(function() {
		displayWindow(jQuery(this));
		return false;
	});
	return this;
};

jQuery.fn.css3 = function(attr, value) {
	var it = this;
	jQuery.each(['', '-moz-', '-webkit-', '-o-', '-ms-'], function(i, prefix) {
		it.css(prefix + attr, value);
	});
	return this;
}

var props = ['Width', 'Height'];
var prop;

while (prop = props.pop()) {
	(function (natural, prop) {
		jQuery.fn[natural] = (natural in new Image()) ? 
		function () {
		return this[0][natural];
		} : 
		function () {
		var 
		node = this[0],
		img,
		value;

		if (node.tagName.toLowerCase() === 'img') {
			img = new Image();
			img.src = node.src,
			value = img[prop];
		}
		return value;
		};
	}('natural' + prop, prop.toLowerCase()));
}