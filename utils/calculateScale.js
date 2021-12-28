function CalculateScale(renderer, texture) {
    let horizontalFit = renderer.width / texture.width;
    let verticalFit = renderer.height / texture.height;

    // Given the input, calculates how to fit the texture in the component by adapting to the "longest" side
    if (horizontalFit < verticalFit) {
        return {
            x: 0,
            y: Math.abs((renderer.height / 2) - (texture.height * horizontalFit / 2)),
            scale: { x: horizontalFit, y: horizontalFit},
        }

    } else {
        return {
            x: Math.abs((renderer.width / 2) - (texture.width * verticalFit / 2)),
            y: 0,
            scale: { x: verticalFit, y: verticalFit},
        }
    }
}

export default CalculateScale;