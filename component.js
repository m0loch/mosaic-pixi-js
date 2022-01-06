import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import Board from './board';
import WinScreen from './winScreen';
import RandomizeTiles from './utils/randomizeTiles';
import CalculateTileTexture from './utils/calculateTileTexture';

function Mosaic(props) {

    const mainRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [sprites, setSprites] = useState([]);
    const [victory, setVictory] = useState(false);

    const onVictory = () => {
        setVictory(true);
    }

    const newGame = useCallback(() => {
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
                realIndex: cfg[i], // this will keep track of where the tile will need to end up
                currIndex: i,
                texture,
                x: (i % props.cols) * tileWidth,
                y: Math.floor(i / props.cols) * tileHeight,
            });
        }

        setSprites(tiles);
        setVictory(false);
    }, [props]);

    useEffect(() => {
        const loader = PIXI.Loader.shared;

        if (!PIXI.utils.TextureCache['img']) {
            loader
                .add('img', props.img)
                .load(() => {
                    setLoaded(true);
                    newGame();
                });
        }

    }, [newGame, props.img])

    return (
        <div style={{position: "relative", margin: "auto", width: "100%", height: "100%", display: "flex", alignContent: "center", justifyContent: "center"}} ref={mainRef}>
            {(victory) ? <WinScreen onClick={newGame}></WinScreen> : null}
            {
                <Stage style={{margin:"auto"}}>
                    <Board
                        image={props.img}
                        rows={props.rows}
                        cols={props.cols}
                        sprites={sprites}
                        loaded={loaded}
                        onVictory={onVictory}
                        victory={victory}
                    />
                </Stage>
            }
        </div>
    );
}

export default Mosaic;