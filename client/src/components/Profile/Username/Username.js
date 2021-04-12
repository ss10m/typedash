// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import { Textfit } from "react-textfit";

// Hooks
import { useWindowSize } from "hooks";

// SCSS
import "./Username.scss";

const negativeIndent = {
    0: "-50px",
    1: "-25px",
    2: "-90px",
    3: "0",
};

const Username = ({ text }) => {
    const size = useWindowSize();
    const [dimensions, setDimentions] = useState({ rows: 0, columns: 0 });
    const [usernameHeight, setUsernameHeight] = useState(0);
    const fillerRef = useRef(null);
    const canvasRef = useRef(null);
    const parsedText = text.toUpperCase();

    useEffect(() => {
        let canvas;
        if (canvasRef.current) {
            canvas = canvasRef.current;
        } else {
            canvas = document.createElement("canvas");
            canvasRef.current = canvas;
        }

        const context = canvas.getContext("2d");
        context.font = "600 45px Jost";
        const metrics = context.measureText(parsedText);
        const rows = Math.round(fillerRef.current.clientHeight / 40) + 2;
        const columns = Math.round(fillerRef.current.clientWidth / metrics.width) + 2;

        setUsernameHeight(fillerRef.current.clientHeight);
        setDimentions({ rows, columns });
    }, [size, text]);

    const names = `${parsedText} `.repeat(dimensions.columns);

    return (
        <div ref={fillerRef} className="profile-username">
            <div className="username">
                {usernameHeight && (
                    <Textfit
                        mode="single"
                        forceSingleModeWidth={false}
                        max={500}
                        style={{
                            height: usernameHeight,
                            lineHeight: usernameHeight + "px",
                            fontWeight: "600",
                        }}
                    >
                        {parsedText}
                    </Textfit>
                )}
            </div>
        </div>
    );
};

export default Username;
