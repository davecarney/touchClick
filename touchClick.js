/*
*	touchClick.js v 2.0
*	Eliminates duplicate execution of script upon tap/click (Ghost clicks)
*
*	By: Dave Carney, 2019
*	dave@vehiclemedia.com
*
*	Requires jQuery-3.2.1
*
*	touchClick();
*		Usage:
*			$('EXAMPLE-ELEMENT').touchClick('OPTIONAL-NAMESPACE', function(e) {
*				console.log('a ' + e.originalEvent.type + ' event happened first');
*			});
*		To remove listener:
*			$('EXAMPLE-ELEMENT').touchClickOff('NAMESPACE-TO-REMOVE');
*
*	touchHover();
*		Pre-built (hover/click an element) --> (Show this other element) function
*		Used to perform "hovers" on touchscreens via adding .touch-active to the element
*		Usage:
*			Markup --> assign .touch-anchor to the element that will trigger the show/reveal
*			Markup --> assign .touch-target to the element that will be revealed (MUST be a child of the .touch-anchor element)
*			Style  --> .touch-target { display: none; }
*			Style  --> .touch-target.touch-active { display: WHATEVER; }
*		Notes:
*			Don't use pseudo-classes, .touch-anchor:hover {...}, they don't exist on touchscreens
*			The parent .touch-anchor will also get .touch-active in case you need to target that element as well
*/

(function($) {
	$.fn.touchClick = function(nameSpace, fnc) {

		var actions;
		var watcher = this;

		if (typeof nameSpace === 'string' || nameSpace instanceof String) {
			nameSpace = '.' + nameSpace;
			actions = 'click' + nameSpace + ' touchend' + nameSpace + ' pointerup' + nameSpace;
		} else {
			actions = 'click touchend pointerup';
			fnc = nameSpace;
		}

		$(this).on(actions, function(e) {
			if (e.originalEvent.type === 'pointerup') {
				watcher.pointed = true;
				watcher.hasRun = false;
				watcher.touched = true;
			}
			if (!watcher.hasRun) {
				fnc(e);
				watcher.hasRun = true;
			} else if (e.originalEvent.type === 'touchend') {
				if (!watcher.pointed) {
					watcher.touched = true;
					fnc(e);
				} else {
					watcher.pointed = false;
				}
			} else {
				if (!watcher.touched) {
					fnc(e);
				} else {
					watcher.touched = false;
					watcher.pointed = false;
				}
			}
		});

	};

	$.fn.touchClickOff = function(nameSpace) {
		var actions = 'click.' + nameSpace + ' touchend.' + nameSpace + ' pointerup.' + nameSpace;
		$(this).off(actions);
	};

	$.fn.touchHover = function() {

		var clickPause = [];
		var eventSetting = 0;
		var anchors = this;

		function buildAnchorObject() {

			// Cache the elements
			this.anchor = $(this);
			this.hiddenItem = $(this).find('.touch-target:first');
			this.active = false;
			this.activeChild = false;
			this.allowClickThrough = false;
			this.siblingAnchors = $(this).siblings('.touch-anchor');
			this.childAnchors = $(this).find('.touch-anchor');
			this.parentAnchors = $(this).parents('.touch-anchor');
			(!this.parentAnchors.length) ? this.noParent = true : this.noParent = false;

			// show an item
			this.reveal = function() {
				this.activeItemCheck();
				this.active = true;
				$(this).addClass('touch-active');
				this.hiddenItem.addClass('touch-active');
				this.parentAnchors.each(function() {
					this.activeChild = true;
				});
				observeEvents();
			}

			// Hide an item
			this.conceal = function() {
				this.active = false;
				this.activeChild = false;
				this.allowClickThrough = false;
				$(this).removeClass('touch-active');
				this.hiddenItem.removeClass('touch-active');
				this.childAnchors.each(function() {
					this.active = false;
					this.activeChild = false;
					this.allowClickThrough = false;
					this.removeClass('touch-active');
					this.hiddenItem.removeClass('touch-active');
				});
			}

			// Check for active ancestor and sibling anchors
			this.activeItemCheck = function() {
				if (this.noParent) {
					concealAll();
					return;
				}
				this.siblingAnchors.each(function() {
					if (this.active) {
						this.conceal();
					}
				});
			}

		} // end of buildAnchorObject();

		anchors.each(buildAnchorObject);

		// Hide all items
		function concealAll() {
			anchors.each(function() {
				this.active = false;
				this.activeChild = false;
				this.allowClickThrough = false;
				$(this).removeClass('touch-active');
				this.hiddenItem.removeClass('touch-active');
			});
			ignoreEvents();
		}

		function allowClick(anchor) {
			clickPause.push(setTimeout(function() {
				if (anchor.active) { anchor.allowClickThrough = true; }
			}, 70));
		}

		// Set event listeners
		$(anchors).on('click touchend pointerup', function(e) {
			if (!this.allowClickThrough) {
				e.stopPropagation();
				e.preventDefault();
				allowClick(this);
			}
			if (e.originalEvent.type === 'pointerup') {
				this.pointed = true;
				this.hasRun = false;
				this.touched = true;
			}
			if (!this.hasRun) {
				if (!this.active) {
					this.reveal();
				}
				this.hasRun = true;
			} else if (e.originalEvent.type === 'touchend') {
				if (!this.pointed) {
					this.touched = true;
					if (!this.active) {
						this.reveal();
					}
				} else {
					this.pointed = false;
				}
			} else {
				if (!this.touched) {
					if (!this.active) {
						this.reveal();
					}
				} else {
					this.touched = false;
					this.pointed = false;
				}
			}
		});

		$(anchors).on('mouseenter', function() {
			if (!this.allowClickThrough) { allowClick(this); }
			if (!this.active) { this.reveal(); }
		});

		function observeEvents() {
			if (eventSetting === 0) {
				$(document).touchClick('outside', function(e) {
					if (!$(e.target).closest('.touch-anchor').length) {
						concealAll();
					}
				});

				$(document).on('mousemove.outside', function(e) {
					if (!$(e.target).closest('.touch-anchor').length) {
						concealAll();
					} else if ($(e.target).closest('.touch-anchor')[0].activeChild) {
						$(e.target).closest('.touch-anchor')[0].childAnchors.each(function() {
							this.conceal();
						});
					}
				});

				eventSetting++;
			}
		}

		function ignoreEvents() {
			$(document).touchClickOff('outside');
			$(document).off('mousemove.outside');
			eventSetting = 0;
		}

	}; // End of $.fn.touchHover

	$('.touch-anchor').touchHover();

}(jQuery));