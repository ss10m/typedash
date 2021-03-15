// Libraries & utils
import React from "react";
import classNames from "classnames";

// Helpers
import { STATE } from "helpers/constants";

// Icons
import { FaTrophy } from "react-icons/fa";

// SCSS
import "./Scoreboard.scss";

const Scoreboard = ({ state, players, socketId, setSpectate, isReady, setReady }) => {
    if (!players.length) return <div>Waiting for players</div>;
    const canSpectate = state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN;
    const showReady = state.current !== STATE.PLAYING;

    return (
        <div className="scoreboard">
            <div className="header">
                <div>SCOREBOARD</div>
            </div>
            <div className="players-wrapper">
                <div
                    className={classNames("start", {
                        mini: players.length === 1,
                    })}
                >
                    START
                </div>
                <div className="players">
                    {players.map((player) => (
                        <Player
                            key={player.socketId}
                            player={player}
                            isCurrent={player.socketId === socketId}
                            canSpectate={canSpectate && player.socketId === socketId}
                            setSpectate={setSpectate}
                            showReady={showReady}
                        />
                    ))}
                </div>
                <div className="flag"></div>
            </div>
        </div>
    );
};

const Player = ({ player, isCurrent, canSpectate, setSpectate, showReady }) => {
    const dot = String.fromCharCode(183);

    return (
        <div className={classNames("player", { extended: canSpectate })}>
            <div className={classNames("details", { left: player.leftRoom })}>
                <div className="username">
                    {player.username}
                    {isCurrent && <span>[ME]</span>}
                    {showReady && (
                        <div
                            className={classNames("ready", {
                                not: !player.isReady,
                            })}
                        >
                            {player.isReady ? "READY" : "NOT READY"}
                        </div>
                    )}
                </div>
                {player.stats.position && (
                    <div className="position">
                        {player.stats.position <= 3 && (
                            <span
                                style={{
                                    color: trophyColor(player.stats.position),
                                }}
                            >
                                <FaTrophy />
                            </span>
                        )}
                        {`${ordinalSuffix(player.stats.position)}`}
                        {player.stats.wpm && `  ${dot}  ${player.stats.wpm}wpm`}
                        {player.stats.accuracy && `  ${dot}  ${player.stats.accuracy}%`}
                    </div>
                )}
                {player.stats.wpm && !player.stats.position && (
                    <div className="wpm">{`${player.stats.wpm}wpm`}</div>
                )}
                {canSpectate && (
                    <div className="spectate" onClick={() => setSpectate(true)}>
                        SPECTATE
                    </div>
                )}
            </div>
            <div className="progress" style={{ width: `${player.stats.progress}%` }} />
        </div>
    );
};

const ordinalSuffix = (position) => {
    if (!Number.isInteger(position)) return position;
    const j = position % 10;
    const k = position % 100;
    if (j === 1 && k !== 11) {
        return position + "st";
    }
    if (j === 2 && k !== 12) {
        return position + "nd";
    }
    if (j === 3 && k !== 13) {
        return position + "rd";
    }
    return position + "th";
};

const trophyColor = (position) => {
    switch (position) {
        case 1:
            return "#FEE101";
        case 2:
            return "#A7a7AD";
        case 3:
            return "#A77044";
        default:
            return;
    }
};

export default Scoreboard;
