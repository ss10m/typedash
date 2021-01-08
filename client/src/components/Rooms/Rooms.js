// Libraries & utils
import React from "react";
import classNames from "classnames";
import { useTable, useSortBy } from "react-table";

// SCSS
import "./Rooms.scss";

// Icons
import { IconContext } from "react-icons";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import {
    FaSort,
    FaSortUp,
    FaSortDown,
    FaPlay,
    FaPause,
    FaStop,
    FaUser,
    FaTimes,
} from "react-icons/fa";

import keyboard from "./kb.jpg";

export default (props) => {
    const {
        windowSize: { height },
    } = props;

    return (
        <div className="rooms" style={{ height: height - 120 }}>
            <div className="rooms-inside">
                <Lobby {...props} />
            </div>
        </div>
    );
};

function Lobby(props) {
    return (
        <div className="lobby">
            <div className="imag">
                <img className="kb" src={keyboard} />
            </div>
            <Navigation {...props} />
            <CustomTable {...props} />
        </div>
    );
}

function Navigation(props) {
    return (
        <div className="rooms-nagivation">
            <div className="create-btn" onClick={props.createRoom}>
                Create Room
            </div>
            <div
                className={classNames("refresh-btn", {
                    "refresh-btn-disabled": props.refreshDisabled,
                })}
                onClick={props.refreshRooms}
            >
                <span
                    className={classNames({
                        current: props.refreshDisabled,
                    })}
                >
                    <FiRefreshCw />
                </span>
            </div>

            <div className="input-wrapper">
                <div className="icon">
                    <FiSearch />
                </div>
                <input
                    className={classNames({
                        rounded: !props.filter,
                    })}
                    type="text"
                    value={props.filter}
                    onChange={props.handleChange}
                    spellCheck={false}
                    placeholder="Search"
                    autoComplete="off"
                />
                {props.filter && (
                    <div className="icon right">
                        <span onClick={props.clearFilter}>
                            <FaTimes />
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function CustomTable(props) {
    const columns = [
        {
            Header: "Status",
            accessor: "indicator",
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: <FaUser />,
            accessor: "users",
        },
        {
            Header: "",
            accessor: "join",
        },
    ];

    for (let room of props.rooms) {
        room.indicator = <RoomIndicator status={room.status} isEmpty={props.isEmpty} />;
        room.join = () => props.joinRoom(room.id);
    }

    return (
        <div className="table-wrapper">
            <Table columns={columns} data={props.rooms} refresh={props.refreshRooms} />
            {props.isEmpty(props.rooms) && <div className="empty">No rooms found</div>}
        </div>
    );
}

const RoomIndicator = ({ status, isEmpty }) => {
    if (isEmpty(status)) {
        return (
            <IconContext.Provider value={{ color: "red", size: "20px" }}>
                <FaStop />
            </IconContext.Provider>
        );
    }
    if (status.isPlaying) {
        return (
            <IconContext.Provider value={{ color: "green", size: "20px" }}>
                <FaPlay />
            </IconContext.Provider>
        );
    } else {
        return (
            <IconContext.Provider value={{ color: "orange", size: "20px" }}>
                <FaPause />
            </IconContext.Provider>
        );
    }
};

function Table({ columns, data }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    );

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => {
                                if (column.id === "join") {
                                    return (
                                        <th
                                            {...column.getHeaderProps()}
                                            style={{ width: "35%" }}
                                        ></th>
                                    );
                                }

                                if (column.id === "indicator") {
                                    return (
                                        <th {...column.getHeaderProps()}>
                                            {column.render("Header")}
                                        </th>
                                    );
                                }

                                return (
                                    <th
                                        {...column.getHeaderProps(
                                            column.getSortByToggleProps()
                                        )}
                                    >
                                        <div className="header-name">
                                            {column.render("Header")}
                                            {column.isSorted ? (
                                                <span className="sorted">
                                                    {column.isSortedDesc ? (
                                                        <FaSortDown />
                                                    ) : (
                                                        <FaSortUp />
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="unsorted">
                                                    <FaSort />
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    if (cell.column.id === "join") {
                                        return (
                                            <td {...cell.getCellProps()} className="btn">
                                                <button onClick={row.original.join}>
                                                    JOIN
                                                </button>
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
