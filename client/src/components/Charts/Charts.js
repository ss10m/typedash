// Libraries & utils
import React, { useState, useEffect, useMemo } from "react";
import { Chart } from "react-charts";
import Select from "react-select";

// Styles
import * as Styles from "./styles";

const chartOptions = {
    WPM: "WPM",
    ACCURACY: "ACCURACY",
};

const Charts = ({
    type = "linear",
    header,
    graphWpm,
    graphAccuracy,
    labelX,
    labelY,
    showEmpty,
}) => {
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

    if (graphWpm.length < 2 || graphAccuracy.length < 2) {
        if (!showEmpty) return null;
        return (
            <Styles.EmptyChart>
                <div>NOT ENOUGH ROUNDS PLAYED</div>
            </Styles.EmptyChart>
        );
    }

    return (
        <>
            <Styles.Header>
                <p>{header || `${selected.label} TIMELINE`}</p>
                <div>
                    <Select
                        value={selected}
                        options={options}
                        autosize={true}
                        styles={customStyles}
                        onChange={(value) => setSelected(value)}
                    />
                </div>
            </Styles.Header>
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
    const [padded, setPadded] = useState(false);

    useEffect(() => {
        setPadded((current) => !current);
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
        [type]
    );

    return (
        <Styles.Chart>
            <Styles.Background>
                {labelY && <Styles.Tag $wpm>{selected.value}</Styles.Tag>}
                {labelX && <Styles.Tag $progress>PROGRESS (%)</Styles.Tag>}
            </Styles.Background>
            <Styles.Foreground $padded={padded}>
                <div>
                    <Chart data={currentData} axes={axes} primaryCursor secondaryCursor />
                </div>
            </Styles.Foreground>
        </Styles.Chart>
    );
};

export default Charts;
