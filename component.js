import React, { useEffect, useState, useRef } from 'react';
import { Stage } from '@inlet/react-pixi';
import Board from './board';
import WinScreen from './winScreen';

function Mosaic(props) {

    const mainRef = useRef(null);
    const [stageDimensions, setStageDimensions] = useState(null);
    const [victory, setVictory] = useState(false);

    const checkDimensions = () => {
        if (mainRef.current) {
            setStageDimensions({
                width: mainRef.current.offsetWidth,
                height: mainRef.current.offsetHeight,
            });
        }
    }

    const newGame = () => {
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
                            rows={5}
                            cols={10}
                            onVictory={() => setVictory(true)}
                        />
                    </Stage> : null
            }
        </div>
    );
}

export default Mosaic;