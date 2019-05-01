# touchClick.js

touchClick.js v 2.0

jQuery Plugin that eliminates duplicate execution of script upon tap/click (Ghost clicks)

also includes touchHover() Plugin

a pre-built (hover/click an element) --> (show another element) function

Used to perform "hovers" on touchscreens


## touchClick();

Usage:
```
$('EXAMPLE-ELEMENT').touchClick('OPTIONAL-NAMESPACE', function(e) {
	console.log('a ' + e.originalEvent.type + ' event happened first');
});
```
To remove listener:
```
$('EXAMPLE-ELEMENT').touchClickOff('NAMESPACE-TO-REMOVE');
```
touchClick() is essentially a shorthand version of
```
.on('click touchend pointerup', function() {...} )
```
but contains a quintuple check for "if the function has run yet" at each event firing.

Oddly enough, the quintuple check executes faster than a simple timeout.


## touchHover();

Markup:
```
<div class="touch-anchor">
	<a href="#">
		I am a link, hover me and we'll show the hidden content.
		In the case of a touchscreen where hovers don't exist,
		we'll preventDefault the first "tap/click" to allow the hidden content to be revealed
	</a>
	<div class="touch-target">
		<a href="#">I am a hidden link</a>
	</div>
</div>
```
.touch-target MUST be a child of the .touch-anchor

Styling:
```
.touch-target { display: none; }
.touch-target.touch-active { display: WHATEVER; }
```
Don't use pseudo-classes, .touch-anchor:hover {...}, they don't exist on touchscreens

The parent .touch-anchor will also get .touch-active in case you need to target that element as well


## Author

* **Dave Carney** - *Github Profile* - [davecarney](https://github.com/davecarney)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

