import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    "@keyframes appear": {
        "0%": {
            opacity: 0,
        },
        "100%": {
            opacity: 1,
        },
    },
  
    panel: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "var(--header-background)",
        borderRadius: "5px",

        display:"flex",
        alignItems: "center",
        justifyContent: "center",

        opacity: 0,
        animation: "$appear .5s ease-in",
        animationDelay: "2s",
    },
});

function WinScreen(props) {
    const classes = useStyles();

    return(
        <div className={classes.panel} onClick={props.onClick} >
            <h1>VICTORY</h1>
        </div>
    );
}


export default WinScreen;