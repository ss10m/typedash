// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import { Textfit } from "react-textfit";

// Hooks
import { useWindowSize } from "hooks";

// SCSS
import "./Username.scss";

const Username = ({ text }) => {
    // const size = useWindowSize();
    // const [usernameHeight, setUsernameHeight] = useState(0);
    // const fillerRef = useRef(null);
    // const parsedText = text.toUpperCase();

    // useEffect(() => {
    //     setUsernameHeight(fillerRef.current.clientHeight);
    // }, [size]);

    return (
        <div className="profile-username">
            <div className="username">
                <Textfit
                    mode="single"
                    forceSingleModeWidth={false}
                    max={500}
                    style={{
                        height: "100%",
                        lineHeight: "80px",
                        fontWeight: "600",
                    }}
                >
                    {text.toUpperCase()}
                </Textfit>
            </div>
        </div>
    );
};

export default Username;
