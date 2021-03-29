// Libraries & utils
import React, { useState, useEffect } from "react";
import classNames from "classnames";

// Helpers
import { STATE } from "helpers/constants";

// Icons
import { FaTrophy } from "react-icons/fa";

// SCSS
import "./Scoreboard.scss";

const Scoreboard = ({ state, players, socketId, isSpectating, setSpectate }) => {
    if (!players.length) return <AwaitPlayers />;
    const canSpectate =
        !isSpectating &&
        (state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN);
    const showReady = state.current !== STATE.PLAYING;
    const extended = state.current === STATE.POSTGAME;

    return (
        <div className="scoreboard">
            <div className="header">
                <div>SCOREBOARD</div>
                {canSpectate && (
                    <div className="button" onClick={() => setSpectate(true)}>
                        SPECTATE
                    </div>
                )}
            </div>
            <div className="scores">
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
                            showReady={showReady}
                            extended={extended}
                        />
                    ))}
                </div>
                <div className="flag"></div>
            </div>
        </div>
    );
};

const AwaitPlayers = () => {
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDotCount((current) => (current > 2 ? 0 : current + 1));
        }, 500);
        return () => clearInterval(dotsInterval);
    }, []);

    const dots = [];
    for (let i = 0; i < dotCount; i++) {
        dots.push(".");
    }

    return (
        <div className="scoreboard">
            <div className="wait">
                WAITING FOR PLAYERS<span>{dots}</span>
            </div>
        </div>
    );
};

const Player = ({ player, isCurrent, showReady, extended }) => {
    const dot = String.fromCharCode(183);

    return (
        <div className={classNames("player-wrapper", { extended })}>
            <div className={classNames("player", { left: player.leftRoom })}>
                <div className="username">
                    {player.username}
                    {isCurrent && <div>YOU</div>}
                </div>
                {player.stats.wpm && !player.stats.position && (
                    <div className="wpm">{`${player.stats.wpm}wpm`}</div>
                )}
                {(player.stats.position || showReady) && (
                    <div className="details">
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
                                {player.stats.accuracy &&
                                    `  ${dot}  ${player.stats.accuracy}%`}
                            </div>
                        )}
                        {showReady && (
                            <div className="ready-wrapper">
                                <div
                                    className={classNames("ready", {
                                        not: !player.isReady,
                                    })}
                                >
                                    {player.isReady ? "READY" : "NOT READY"}
                                </div>
                            </div>
                        )}
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
