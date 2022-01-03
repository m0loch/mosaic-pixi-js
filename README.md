# mosaic-pixi-js
Pixi.js-based mosaic puzzle game

_by Romeo Graifenberg_

## Description
React component embedding a simple mosaic game.

## How to use
Import it as a submodule on git / import the code in the project.
Use it as a component.

The image that will be broken into tiles shall be fed to the component by having its path passed through the *img* property.

### Note
Trying to load images from an external source will trigger CORS-related errors.
After some investigation it seems like that there's just no way to avoid that, so we just can't link pictures from the wilds.
They either need to be hosted inside the same domain, or on a server set up in a way that explicitly supports CORS.

## Required libraries
PIXI.js
@inlet/react-pixi

## Work that still needs to be done
- improve mobile's aspect
- improve win screen

## Known issues
- resizing should not change the state, doing so at the moment means starting over with the puzzle
- on mobile the application detects the page as very *VERY* long on the phone's longer axis (height in portrait, width in landscape), this prevents the proper offset calculation

## Credits for the pictures
https://syanart.com/
This shall be added to the site's section rather than inside this module, consider this a placeholder.
