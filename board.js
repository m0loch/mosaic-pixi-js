import React, { useCallback, useEffect, useRef, useState } from 'react';
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
        const tileHeight = (texture.height / props.rows);
        const tileWidth = (texture.width / props.cols);
    
        const tiles = [];
        for (let i = 0; i < (props.rows * props.cols); i++) {

            let texture = CalculateTileTexture(
                cfg[i],
                props,
                tileHeight,
                tileWidth);

            tiles.push({
                realIndex: i, // this will keep track of where the tile will need to end up
                texture,
                x: (i % props.cols) * tileWidth,
                y: Math.floor(i / props.cols) * tileHeight,
            });
        }

        setSprites(tiles);
        setLoaded(true);
    }, [props]);

    useEffect(() => {
        if (!PIXI.utils.TextureCache['img']) {
            app.loader
                .add('img', props.image)
                .load(initGame);
        }
    }, [app, initGame, props.image]);

    const spriteRefs = useRef([]);

    if (!loaded) {
        return(null);
    }

    const handleBeginTouch = (sprite, event) => {
        sprite.isPressed = true;

        // NB: in order for this to work, we need the parent to have the sortableChildren property active
        sprite.zIndex = 1;

        sprite.touchOffset = event.data.getLocalPosition(sprite);

        sprite.originalPos = {
            x: sprite.x,
            y: sprite.y,
        };
    }

    const handleDrag = (sprite, event) => {
        if (sprite.isPressed) {
            let newPos = event.data.getLocalPosition(sprite.parent);
            newPos.x -= sprite.touchOffset.x;
            newPos.y -= sprite.touchOffset.y;
            sprite.position = newPos;
        }
    }
    
    const handleEndTouch = (sprite, event) => {

        sprite.isPressed = false;

        const container = sprite.parent;
        const targetPos = event.data.getLocalPosition(container);

        const targetSprite = container.children.find(
            child => (child.idx !== sprite.idx)
                    && (Math.abs(child.position.x - targetPos.x) < (sprite.width))
                    && (Math.abs(child.position.y - targetPos.y) < (sprite.height))
        );

        if (targetSprite) {
            // Perform move
            sprite.position.x = targetSprite.position.x;
            sprite.position.y = targetSprite.position.y;

            targetSprite.position.x = sprite.originalPos.x;
            targetSprite.position.y = sprite.originalPos.y;

            // TODO: add victory check
        } else {
            // Rollback move
            sprite.position.x = sprite.originalPos.x;
            sprite.position.y = sprite.originalPos.y;
        }

        sprite.z = 0;
    }

    const resizeParams = CalculateScale(app.renderer, PIXI.utils.TextureCache['img']);

    return (
        <Container sortableChildren={true} {...resizeParams}>
            {sprites.map((sprite, currIdx) => {
                return(
                    <Sprite
                        key={sprite.realIndex}
                        idx={sprite.realIndex}
                        currIdx={currIdx}
                        interactive={true}
                        texture={sprite.texture}
                        x={sprite.x}
                        y={sprite.y}
                        ref={el => spriteRefs.current[sprite.realIndex] = el}
                        pointerup={event => handleEndTouch(spriteRefs.current[sprite.realIndex], event)}
                        pointerdown={event => handleBeginTouch(spriteRefs.current[sprite.realIndex], event)}
                        pointermove={event => handleDrag(spriteRefs.current[sprite.realIndex], event)}
                    />
                )
            })}
        </Container>
    );
}

export default Board;