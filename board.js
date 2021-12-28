import React, { useEffect, useState } from 'react';
import { Sprite, useApp } from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'

function Board(props) {

    const app = useApp();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        app.loader
            .add('img', props.image)
            .load(() => setLoaded(true));
    }, [app, props.image]);

    if (!loaded) {
        return(null);
    }

    // slice into tiles

    return (
        <Sprite texture={PIXI.utils.TextureCache['img']}/>
    );
}

export default Board;