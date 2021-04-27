// Libraries & utils
import React, { useEffect } from "react";

// Styles
import * as Styles from "./styles";

const Checkmark = ({ diameter, close }) => {
    useEffect(() => {
        if (!close) return;

        const id = setTimeout(() => {
            close();
        }, 2000);

        return () => clearTimeout(id);
    }, [close]);

    return (
        <Styles.Checkmark
            viewBox="0 0 26 26"
            xmlns="http://www.w3.org/2000/svg"
            $diameter={diameter || 150}
        >
            <g>
                <Styles.Circle d="M13 1C6.372583 1 1 6.372583 1 13s5.372583 12 12 12 12-5.372583 12-12S19.627417 1 13 1z" />
                <Styles.Tick d="M6.5 13.5L10 17 l8.808621-8.308621" />
            </g>
        </Styles.Checkmark>
    );
};

export default Checkmark;
