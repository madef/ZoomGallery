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

$.fn.zoomgallery = function(options) {
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
	var opts = $.extend(defaults, options);
	
	var currentImg = 0; // Img curently view for gallery mode
	var gallery = $(this);
	
	var zoomId = 0;
	// Add windows
	$(this).each(function() {
		// Set a zoomId
		$(this).attr('zoomId', zoomId);
		var img = $(this);
		
		
		var win = $('<div></div>')
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
			.append($('<img />')
				.css('width', '100%')
				.css('height', '100%')
				.click(function() {
					if ($(this).parent().get(0).dragging) {
						return false;
					}
					hideWindow(img);
					return false;
				})
			)
			.append(
				$('<div class="' + opts.limiterClassName + '"></div>')
					.css3('user-select', 'none')
					.css3('user-drag', 'none')
					.click(function() {
						$(this).parent().find('img').click();
					})
			);
		
		if (opts.navbar) {
			win.append(
				$('<div class="' + opts.navbarClassName + '"></div>')
					.append(
						$('<div class="' + opts.previousButtonClassName + '"></div>')
							.click(function() { prev(); })
					 )
					.append(
						$('<div class="' + opts.nextButtonClassName + '"></div>')
							.click(function() { next(); })
					 )
					
			);
		}
		if (opts.titlebar) {
			win.append(
				$('<div class="' + opts.titlebarClassName + '"></div>')
					.html(img.find('img').attr('title'))
			);
		}
		
		$('body').append(win);
		
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
						} else if (top < - $(this).find('img').height() + $(this).height()) {
							top = - $(this).find('img').height() + $(this).height();
						}
						
						if (left > 0) {
							if (opts.galleryMod) {
								if ((left) /  $(this).find('img').width() > 0.2) {
									this.dragStarted = true;
									prev();
								}
								$(this).find('.' + opts.limiterClassName).css({
									boxShadow: (left / 6) + 'px 0 57px ' + $(this).find('.' + opts.limiterClassName).css('border-left-color'),
									left: 'auto',
									right: '100%'
								});
							}
							left = 0;
						} else if (left < - $(this).find('img').width() + $(this).width()) {
							if (opts.galleryMod) {
								if ((left + $(this).find('img').width() - $(this).width()) /  $(this).find('img').width() < -0.2) {
									this.dragStarted = true;
									next();
								}
								$(this).find('.' + opts.limiterClassName).css({
									boxShadow: (left + $(this).find('img').width() - $(this).width()) / 6 + 'px 0 57px ' + $(this).find('.' + opts.limiterClassName).css('border-left-color'),
									left: '100%',
									right: 'auto'
								});
								left = $(this).find('img').width() - $(this).width() + (left + $(this).find('img').width() - $(this).width()) / 6;
							}
							left = - $(this).find('img').width() + $(this).width();
						}
						
						$(this).find('img').css({
							top: top,
							left: left
						});
					}
					return false;
				})
 				.on('dragend', function(ev) {
					var it = this;
					$(this).find('.' + opts.limiterClassName).css({
						boxShadow: '0 0 0 ' + $(this).find('.' + opts.limiterClassName).css('border-left-color'),
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
		var win = $(win).get(0);
		if (!$(win).is(':visible')) {
			return;
		}
		
		if ($.browser.msie) {
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
		} else {
			var windowHeight = Math.min($(window).height(), document.body.clientHeight);
			var windowWidth =Math.min($(window).width(), document.body.clientWidth);
		}
		
		var wMarge = $(win).outerWidth(true) - $(win).outerWidth();
		var hMarge = $(win).outerHeight(true) - $(win).outerHeight();
		
		var wRate = ($(win).find('img').naturalWidth() + wMarge) / windowWidth;
		var hRate = ($(win).find('img').naturalHeight() + hMarge) / windowHeight;
		
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
				$(win).addClass(opts.mobileZoomClassName);
				$(win).css3('transition-duration', '0s');
				if (wRate > hRate) {
					var width = ($(win).find('img').naturalWidth() + wMarge) / hRate;
					var left = - (width - windowWidth) / 2;
					$(win).find('img').css({
						height: windowHeight + 'px',
						width: width + 'px',
						left: left,
						top: 0
					});
				} else {
					$(win).addClass(opts.mobileZoomClassName);
					var height = ($(win).find('img').naturalHeight()) / wRate - hMarge;
					var top = - (height - windowHeight) / 2;
					$(win).find('img').css({
						height: height + 'px',
						width: windowWidth + 'px',
						left: 0,
						top: top
					});
				}
			} else {
				win.mobileZoom = false;
				$(win).removeClass(opts.mobileZoomClassName);
				$(win).css3('transition-duration', opts.animationDuration + 's');
				
				$(win).find('img').css({
					height: '100%',
					width: '100%',
					top: '0',
					left: '0'
				});
			
				$(win).css({
					height: $(win).find('img').naturalHeight() + 'px',
					width: $(win).find('img').naturalWidth() + 'px',
					top: (windowHeight - $(win).find('img').naturalHeight()) / 2 + $(document).scrollTop() + 'px',
					left: (windowWidth - $(win).find('img').naturalWidth()) / 2 + $(document).scrollLeft() + 'px'
				});
			}
		} else {
			win.mobileZoom = false;
			$(win).removeClass(opts.mobileZoomClassName);
			$(win).css3('transition-duration', opts.animationDuration + 's');
			
			$(win).find('img').css({
				height: '100%',
				width: '100%',
				top: '0',
				left: '0'
			});
			
			win.mobileZoom = false;
			if (wRate > 1 || hRate > 1) {
				if (wRate > hRate) {
					$(win).css({
						width: windowWidth - wMarge + 'px',
						height: ($(win).find('img').naturalHeight() + hMarge) / wRate - hMarge + 'px',
						top: (windowHeight - $(win).find('img').naturalHeight() / wRate) / 2 - hMarge / 2 + $(document).scrollTop() + 'px',
						left: $(document).scrollLeft()
					});
				} else {
					$(win).css({
						height: windowHeight - hMarge + 'px',
						width: ($(win).find('img').naturalWidth() + wMarge) / hRate - wMarge + 'px',
						left: (windowWidth - $(win).find('img').naturalWidth() / hRate) / 2 - wMarge / 2 + $(document).scrollLeft() + 'px',
						top: $(document).scrollTop()
					});
				}
			} else {
				$(win).css({
					height: $(win).find('img').naturalHeight() + 'px',
					width: $(win).find('img').naturalWidth() + 'px',
					top: (windowHeight - $(win).find('img').naturalHeight()) / 2 + $(document).scrollTop() + 'px',
					left: (windowWidth - $(win).find('img').naturalWidth()) / 2 + $(document).scrollLeft() + 'px'
				});
			}
		}
	}
	
	var load = function(elm, callback) {
		var id = elm.attr('zoomId');
		elm.addClass('loading');
		$('#' + opts.windowClassName + id + ' img').attr('src', elm.attr('href'));
		$('#' + opts.windowClassName + id + ' img').load(function() {
				var win = $(this).parent();
				elm.removeClass('loading');
				resizeWindow(win);
				
				if (callback) {
					callback(elm);
				}
				
				var it = $(this).parent();
				$(window).resize(function() {
					resizeWindow(win);
				});
		});
	}
	
	var displayWindow = function(elm) {
		if (!$('#' + opts.windowClassName + elm.attr('zoomId') + ' img').attr('src')) {
			load(elm, displayWindow);
			return;
		}
		
		if (currentImg != elm.attr('zoomId')) {
			hideWindow($(gallery[currentImg]));
		}
		var win = $('#' + opts.windowClassName + elm.attr('zoomId'));
		var wMarge = $(win).outerWidth(true) - $(win).outerWidth();
		var hMarge = $(win).outerHeight(true) - $(win).outerHeight();
		
		var minWMarge = $(elm).outerWidth(true) - $(elm).outerWidth();
		var minHMarge = $(elm).outerHeight(true) - $(elm).outerHeight();
		
		var bodyWMarge = $('body').outerWidth(true) - $('body').outerWidth();
		var bodyHMarge = $('body').outerHeight(true) - $('body').outerHeight();
		currentImg = elm.attr('zoomId');
		
		if ($('body').css('position') != 'static') {
			bodyWMarge = 0;
			bodyHMarge = 0;
		}
		
		win.css3('transition-duration', '0s');
		win.removeClass('expended');
		win.addClass('reset');
		win.css({
			left: elm.offset().left - wMarge / 2 - $('body').offset().left + bodyWMarge / 2,
			top: elm.offset().top - hMarge / 2 - $('body').offset().top + bodyHMarge / 2,
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
		var win = $('#' + opts.windowClassName + elm.attr('zoomId'));
		var wMarge = $(win).outerWidth(true) - $(win).outerWidth();
		var hMarge = $(win).outerHeight(true) - $(win).outerHeight();
		
		var minWMarge = $(elm).outerWidth(true) - $(elm).outerWidth();
		var minHMarge = $(elm).outerHeight(true) - $(elm).outerHeight();
		
		var bodyWMarge = $('body').outerWidth(true) - $('body').outerWidth();
		var bodyHMarge = $('body').outerHeight(true) - $('body').outerHeight();
		
		if ($('body').css('position') != 'static') {
			bodyWMarge = 0;
			bodyHMarge = 0;
		}
		win.css({
			left: elm.offset().left - wMarge / 2 - $('body').offset().left + bodyWMarge / 2,
			top: elm.offset().top - hMarge / 2 - $('body').offset().top + bodyHMarge / 2,
			width: elm.width(),
			height: elm.height(),
			zIndex: 0
		});
		
		win.addClass('reset');
		win.removeClass('expended');
		
		if ($(win).hasClass(opts.mobileZoomClassName)) {
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
		displayWindow($(gallery[newImg]));
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
		displayWindow($(gallery[newImg]));
	}
	
	$(this).click(function() {
		displayWindow($(this));
		return false;
	});
	return this;
};

$.fn.css3 = function(attr, value) {
	var it = this;
	$.each(['', '-moz-', '-webkit-', '-o-', '-ms-'], function(i, prefix) {
		it.css(prefix + attr, value);
	});
	return this;
}

var props = ['Width', 'Height'];
var prop;

while (prop = props.pop()) {
	(function (natural, prop) {
		$.fn[natural] = (natural in new Image()) ? 
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