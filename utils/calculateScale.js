import * as PIXI from 'pixi.js';

function CalculateScale(renderer, texture) {
    let horizontalFit = (renderer.width / window.devicePixelRatio) / texture.width;
    let verticalFit = (renderer.height / window.devicePixelRatio) / texture.height;

    // Given the input, calculates how to fit the texture in the component by adapting to the "longest" side
    if (horizontalFit < verticalFit) {
        return {
            x: 0,
            y: PIXI.utils.isMobile.any ? 0 : Math.abs((renderer.height / 2) - (texture.height * horizontalFit / 2)),
            scale: { x: horizontalFit, y: horizontalFit},
        }

    } else {
        return {
            x: PIXI.utils.isMobile.any ? 0 : Math.abs((renderer.width / 2) - (texture.width * verticalFit / 2)),
            y: 0,
            scale: { x: verticalFit, y: verticalFit},
        }
    }
}

export default CalculateScale;