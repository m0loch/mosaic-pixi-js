import React, { useEffect, useState, useRef } from 'react';
import { Stage, Sprite } from '@inlet/react-pixi'

function Mosaic(props) {

    const mainRef = useRef(null);
    const [stageDimensions, setStageDimensions] = useState(null);

    const checkDimensions = () => {
        if (mainRef.current) {
            setStageDimensions({
                width: mainRef.current.offsetWidth,
                height: mainRef.current.offsetHeight,
            });
        }
    }

    useEffect(() => {
        if (mainRef.current) {
            window.addEventListener('resize', checkDimensions);

            checkDimensions();
        }

        return () => window.removeEventListener("resize", checkDimensions);
    }, [])

    return (
        <div style={{width: "100%", height: "100%"}} ref={mainRef}>
            { (stageDimensions) ?
            <Stage
                width={stageDimensions.width}
                height={stageDimensions.height}
            >
                <Sprite image={props.img}  />
            </Stage> : null
            }
        </div>
    );
}

export default Mosaic;