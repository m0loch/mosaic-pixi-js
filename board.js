import React, { useCallback, useEffect, useState } from 'react';
import { Container, Sprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import CalculateScale from './utils/calculateScale';
import CalculateTileTexture from './utils/calculateTileTexture';
import RandomizeTiles from './utils/randomizeTiles';

function Board(props) {

    const app = useApp();

    const [sprites, setSprites] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const initGame = useCallback(() => {
        const cfg = RandomizeTiles(props.rows * props.cols);

        const texture = PIXI.utils.TextureCache['img'];
        const tileHeight = texture.height / props.rows;
        const tileWidth = texture.width / props.cols;
    
        const tiles = [];
        for (let i = 0; i < (props.rows * props.cols); i++) {

            let texture = CalculateTileTexture(
                cfg[i],
                props,
                tileHeight,
                tileWidth);

            tiles.push({
                texture,
                x: (i % props.cols) * tileWidth,
                y: Math.floor(i / props.cols) * tileHeight,
            });
        }

        setSprites(tiles);
        setLoaded(true);
    }, [props]);

    useEffect(() => {
        app.loader
            .add('img', props.image)
            .load(initGame);
    }, [app, initGame, props.image]);

    if (!loaded) {
        return(null);
    }

    const resizeParams = CalculateScale(app.renderer, PIXI.utils.TextureCache['img']);

    return (
        <Container {...resizeParams}>
            {sprites.map((sprite, idx) => {
                return(
                    <Sprite
                        key={idx}
                        texture={sprite.texture}
                        x={sprite.x}
                        y={sprite.y}
                    />
                )
            })}
        </Container>
    );
}

export default Board;