import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Sprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import CalculateScale from './utils/calculateScale';

function Board(props) {

    const app = useApp();

    const mainRef = useRef(null);
    const spriteRefs = useRef([]);

    const resize = useCallback(() => {
        if (mainRef && mainRef.current) {
            app.renderer.resize(app.view.parentNode.clientWidth, app.view.parentNode.clientHeight);

            const calc = CalculateScale(app.renderer, PIXI.utils.TextureCache['img']);
            mainRef.current.x = calc.x;
            mainRef.current.y = calc.y;
            mainRef.current.scale = {
                x: calc.scale,
                y: calc.scale,
            };
        }
    }, [app.renderer, app.view.parentNode]);

    useEffect(() => {

        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);

    }, [resize]);

    if (!props.loaded) {
        return(null);
    }

    const handleBeginTouch = (sprite, event) => {

        sprite.isPressed = true;
        sprite.touchId = event.data.identifier;

        // NB: in order for this to work, we need the parent to have the sortableChildren property active
        sprite.zIndex = 1;

        sprite.touchOffset = event.data.getLocalPosition(sprite);

        sprite.originalPos = {
            x: sprite.x,
            y: sprite.y,
        };
    }

    const handleDrag = (sprite, event) => {
        if (sprite.isPressed && (sprite.touchId === event.data.identifier)) {
            let newPos = event.data.getLocalPosition(sprite.parent);
            newPos.x -= sprite.touchOffset.x;
            newPos.y -= sprite.touchOffset.y;
            sprite.position = newPos;
        }
    }
    
    const handleEndTouch = (sprite) => {

        sprite.isPressed = false;

        const container = sprite.parent;

        const targetSprite = container.children.find(
            child => (child.idx !== sprite.idx)
                    && (Math.abs(child.position.x - sprite.x) < (sprite.width * 0.5))
                    && (Math.abs(child.position.y - sprite.y) < (sprite.height * 0.5))
        );

        if (targetSprite) {
            // Perform move
            sprite.position.x = targetSprite.position.x;
            sprite.position.y = targetSprite.position.y;

            targetSprite.position.x = sprite.originalPos.x;
            targetSprite.position.y = sprite.originalPos.y;

            const depot = sprite.currIdx;
            sprite.currIdx = targetSprite.currIdx;
            targetSprite.currIdx = depot;

            let err = container.children.find(child => child.idx !== child.currIdx);

            if (!err) {
                props.onVictory();
            }
        } else {
            // Rollback move
            sprite.position.x = sprite.originalPos.x;
            sprite.position.y = sprite.originalPos.y;
        }

        sprite.zIndex = 0;
    }

    resize();

    return (
        <Container sortableChildren={true} ref={mainRef}>
            { props.victory ? (
                    <Sprite
                        texture={PIXI.utils.TextureCache['img']}
                    />
                ) : props.sprites?.map((sprite) => {
                    return (
                        <Sprite
                            key={sprite.realIndex}
                            idx={sprite.realIndex}
                            currIdx={sprite.currIndex}
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
                })
            }
        </Container>
    );
}

export default Board;