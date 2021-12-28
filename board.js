import React, { useEffect, useState } from 'react';
import { Sprite, useApp } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import CalculateScale from './utils/calculateScale';

function Board(props) {

    const app = useApp();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        app.loader
            .add('img', props.image)
            .load(() => setLoaded(true));
        
        console.log('effected');
    }, [app, props.image]);

    if (!loaded) {
        return(null);
    }

    const resizeParams = CalculateScale(app.renderer, PIXI.utils.TextureCache['img']);

    // slice into tiles

    return (
        <Sprite
            texture={PIXI.utils.TextureCache['img']}
            {...resizeParams}
        />
    );
}

export default Board;