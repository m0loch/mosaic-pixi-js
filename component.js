import React, { useEffect, useState, useRef } from 'react';
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

    const [stageDimensions, setStageDimensions] = useState(null);

    const checkDimensions = () => {
        if (mainRef.current) {
            setStageDimensions({
                width: mainRef.current.offsetWidth,
                height: mainRef.current.offsetHeight,
            });
        }
    }

    const onLoaded = () => {
        setLoaded(true);
        newGame();
    }

    const onVictory = () => {
        setVictory(true);
    }

    const newGame = () => {
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
    }

    useEffect(() => {
        if (mainRef.current) {
            window.addEventListener('resize', checkDimensions);

            checkDimensions();
        }

        return () => window.removeEventListener("resize", checkDimensions);
    }, [])

    return (
        <div style={{position: "relative", width: "100%", height: "100%"}} ref={mainRef}>
            {(victory) ? <WinScreen onClick={newGame}></WinScreen> : null}
            { 
                (stageDimensions) ?
                    <Stage
                        width={stageDimensions.width}
                        height={stageDimensions.height}
                    >
                        <Board
                            image={props.img}
                            rows={props.rows}
                            cols={props.cols}
                            sprites={sprites}
                            loaded={loaded}
                            onLoaded={onLoaded}
                            onVictory={onVictory}
                            victory={victory}
                        />
                    </Stage> : null
            }
        </div>
    );
}

export default Mosaic;