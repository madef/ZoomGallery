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
 * @version 0.2
 */

$.fn.zoomgallery = function(options) {
	// Defaults vars
	var defaults = {
		navbar: true,
		titlebar: true,
		galleryMod: true,
		infinite: true,
		windowClassName: 'zoomWindow',
		animationDuration: 0.6,
	};
	// Extend our default options with those provided.
	var opts = $.extend(defaults, options);
	
	var currentImg = 0; // Img curently view for gallery mode
	var gallery = $(this);
	
	var zoomId = 0;
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
				.click(function() { hideWindow(img); })
			);
		
		if (opts.navbar) {
			win.append(
				$('<div class="navbar"></div>')
					.append(
						$('<div class="prev"></div>')
							.click(function() { prev(); })
					 )
					.append(
						$('<div class="next"></div>')
							.click(function() { next(); })
					 )
					
			);
		}
		if (opts.titlebar) {
			win.append(
				$('<div class="titlebar"></div>')
					.html(img.find('img').attr('title'))
			);
		}
		
		$('body').append(win);
		
		if (opts.navbar) {
		}
		
		zoomId++
	});
	
	var resizeWindow = function(win) {
		var win = $(win).get(0);
		if (!$(win).is(':visible')) {
			return;
		}
		var windowHeight = Math.min($(window).height(), document.body.clientHeight);
		var windowWidth =Math.min($(window).width(), document.body.clientWidth);
		var wMarge = $(win).outerWidth(true) - $(win).outerWidth();
		var hMarge = $(win).outerHeight(true) - $(win).outerHeight();
		var wRate = ($(win).find('img').get(0).naturalWidth + wMarge) / windowWidth;
		var hRate = ($(win).find('img').get(0).naturalHeight + hMarge) / windowHeight;
console.log($(win).find('img').get(0).naturalHeight);
console.log(hRate, wRate, windowHeight);

		if (wRate > 1 || hRate > 1) {
			if (wRate > hRate) {
				$(win).css({
					width: windowWidth - wMarge + 'px',
					height: ($(win).find('img').get(0).naturalHeight + hMarge) / wRate - hMarge + 'px',
					top: (windowHeight - $(win).find('img').get(0).naturalHeight / wRate) / 2 - hMarge / 2 + $(document).scrollTop() + 'px',
					left: $(document).scrollLeft()
				});
			} else {
				$(win).css({
					height: windowHeight - hMarge + 'px',
					width: ($(win).find('img').get(0).naturalWidth + wMarge) / hRate - wMarge + 'px',
					left: (windowWidth - $(win).find('img').get(0).naturalWidth / hRate) / 2 - wMarge / 2 + $(document).scrollLeft() + 'px',
					top: $(document).scrollTop()
				});
			}
		} else {
			$(win).css({
				height: $(win).find('img').get(0).naturalHeight + 'px',
				width: $(win).find('img').get(0).naturalWidth + 'px',
				top: (windowHeight - $(win).find('img').get(0).naturalHeight) / 2 + 'px',
				left: (windowWidth - $(win).find('img').get(0).naturalWidth) / 2 + 'px'
			});
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
		currentImg = elm.attr('zoomId');
		
		win.css3('transition-duration', '0');
		win.removeClass('expended');
		win.addClass('reset');
		win.css({
			top: elm.offset().top - $('body').offset().top - hMarge / 2 + minHMarge / 2,
			left: elm.offset().left - $('body').offset().left - wMarge / 2 + minWMarge / 2,
			width: elm.width(),
			height: elm.height(),
			zIndex: 1
		});
		win.show();
		elm.css('visibility', 'hidden');
		win.css3('transition-duration', opts.animationDuration + 's');
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
		win.css({
			top: elm.offset().top - $('body').offset().top - hMarge / 2 + minHMarge / 2,
			left: elm.offset().left - $('body').offset().left - wMarge / 2 + minWMarge / 2,
			width: elm.width(),
			height: elm.height(),
			zIndex: 0
		});
		win.addClass('reset');
		win.removeClass('expended');
		setTimeout(function() {
			elm.css('visibility', 'visible');
			win.hide();
		}, opts.animationDuration * 1000)
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
	$.each(['', '-moz-', '-webkit-', '-o-', '-ie-'], function(i, prefix) {
		it.css(prefix + attr, value);
	});
	return this;
}