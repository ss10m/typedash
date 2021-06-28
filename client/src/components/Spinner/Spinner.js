// Libraries & utils
import React from "react";

// Styles
import * as Styled from "./styles";

const Spinner = ({ size }) => {
    return (
        <Styled.Spinner $size={size}>
            <Styled.Svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <Styled.Circle
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="30"
                />
            </Styled.Svg>
        </Styled.Spinner>
    );
};

export default Spinner;
