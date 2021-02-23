// Libraries & utils
import React from "react";

// SCSS
import "./Spinner.scss";

const Spinner = ({ size }) => {
    const style = { width: size, height: size };

    return (
        <div className="spinner" style={style}>
            <svg
                width="100px"
                height="100px"
                viewBox="0 0 66 66"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="path"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    cx="33"
                    cy="33"
                    r="30"
                />
            </svg>
        </div>
    );
};

export default Spinner;
