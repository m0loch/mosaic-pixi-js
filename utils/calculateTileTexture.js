import * as PIXI from 'pixi.js';

function CalculateTileTexture(index, props, tileHeight, tileWidth) {
    const texture = PIXI.utils.TextureCache['img'];

    let x = (index % props.cols) * tileWidth;
    let y = Math.floor(index / props.cols) * tileHeight;

    let rect = new PIXI.Rectangle(x, y, tileWidth, tileHeight);
    
    return new PIXI.Texture(texture, rect);
}

export default CalculateTileTexture;