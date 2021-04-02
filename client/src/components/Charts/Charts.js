// Libraries & utils
import React, { useState, useEffect, useMemo } from "react";
import { Chart } from "react-charts";
import Select from "react-select";

// SCSS
import "./Charts.scss";

const chartOptions = {
    WPM: "WPM",
    ACCURACY: "ACCURACY",
};

const Charts = ({ type = "linear", graphWpm, graphAccuracy, labelX, labelY }) => {
    const [selected, setSelected] = useState({
        value: chartOptions.WPM,
        label: chartOptions.WPM,
    });

    const options = useMemo(
        () => [
            { value: chartOptions.WPM, label: chartOptions.WPM },
            { value: chartOptions.ACCURACY, label: chartOptions.ACCURACY },
        ],
        []
    );

    const customStyles = useMemo(
        () => ({
            control: (base, state) => ({
                ...base,
                background: "#162029",
                borderRadius: state.isFocused ? "3px 3px 0 0" : "3px",
                borderColor: "#3a5068",
                boxShadow: state.isFocused ? null : null,
                "&:hover": {
                    borderColor: "#56779a",
                    cursor: "pointer",
                },
            }),
            menu: (base) => ({
                ...base,
                marginTop: 0,
            }),
            menuList: (base) => ({
                ...base,
                padding: "10px 0",
                background: "#2c3f54",
                color: "whitesmoke",
            }),
            singleValue: (provided) => ({
                ...provided,
                color: "whitesmoke",
            }),
            option: (styles, state) => ({
                ...styles,
                cursor: "pointer",
                background: state.isSelected ? "#3a5068" : "#2c3f54",
                "&:hover": {
                    background: "#56779a",
                },
                "&:active": {
                    background: "#3e9dff",
                },
            }),
        }),
        []
    );

    if (
        (selected.value === chartOptions.WPM && !graphWpm.length) ||
        (selected.value === chartOptions.ACCURACY && !graphAccuracy.length)
    ) {
        return null;
    }

    return (
        <>
            <div className="chart-header">
                <p>{`${selected.label} TIMELINE`}</p>
                <div className="select-graph">
                    <Select
                        value={selected}
                        options={options}
                        autosize={true}
                        styles={customStyles}
                        onChange={(value) => setSelected(value)}
                    />
                </div>
            </div>
            <DrawChart
                type={type}
                data={selected.value === chartOptions.WPM ? graphWpm : graphAccuracy}
                selected={selected}
                labelX={labelX}
                labelY={labelY}
            />
        </>
    );
};

const DrawChart = ({ type, data, selected, labelX, labelY }) => {
    const [padding, setPadding] = useState("0");

    useEffect(() => {
        setPadding((current) => (current === "1px" ? "0" : "1px"));
    }, [data]);

    const currentData = useMemo(
        () => [
            {
                label: selected.value,
                data,
            },
        ],
        [data, selected]
    );

    const axes = useMemo(
        () => [
            { primary: true, type, position: "bottom" },
            { type: "linear", position: "left" },
        ],
        []
    );

    return (
        <div className="chart">
            <div className="background">
                {labelY && <div className="wpm-tag">{selected.value}</div>}
                {labelX && <div className="progress-tag">PROGRESS (%)</div>}
            </div>
            <div className="foreground" style={{ marginRight: padding }}>
                <Chart data={currentData} axes={axes} primaryCursor secondaryCursor />
            </div>
        </div>
    );
};

export default Charts;
