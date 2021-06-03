// Libraries & utils
import React, { useState, useEffect } from "react";

// Context
import { useRoomContext } from "../context";

// Helpers
import { STATE } from "helpers/constants";

// Icons
import { FaTrophy } from "react-icons/fa";

// Styles
import * as Styled from "./styles";

const Scoreboard = ({ setSpectate, socketId }) => {
    const { data } = useRoomContext();
    const { state, players, isSpectating } = data;

    if (!players.length) return <AwaitPlayers />;
    const canSpectate =
        !isSpectating &&
        (state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN);
    const showReady = state.current !== STATE.PLAYING;
    const extended = state.current === STATE.POSTGAME;

    return (
        <Styled.Scoreboard>
            <Styled.Header>
                <p>SCOREBOARD</p>
                {canSpectate && (
                    <Styled.Button onClick={() => setSpectate(true)}>SPECTATE</Styled.Button>
                )}
            </Styled.Header>
            <Styled.Scores>
                <Styled.StartLine $minimized={players.length === 1}>START</Styled.StartLine>
                <Styled.Players>
                    {players.map((player) => (
                        <Player
                            key={player.socketId}
                            player={player}
                            isCurrent={player.socketId === socketId}
                            showReady={showReady}
                            extended={extended}
                        />
                    ))}
                </Styled.Players>
                <Styled.FinishLine />
            </Styled.Scores>
        </Styled.Scoreboard>
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
        <Styled.Scoreboard>
            <Styled.Spectating>
                WAITING FOR PLAYERS<span>{dots}</span>
            </Styled.Spectating>
        </Styled.Scoreboard>
    );
};

const Player = ({ player, isCurrent, showReady, extended }) => {
    const dot = String.fromCharCode(183);

    return (
        <Styled.PlayerWrapper $minimized={extended}>
            <Styled.PlayerProgress $progress={player.stats.progress} />
            <Styled.Player $left={player.leftRoom}>
                <Styled.Username>
                    {player.username}
                    {isCurrent && <span>YOU</span>}
                </Styled.Username>
                {player.stats.wpm && !player.stats.position && (
                    <Styled.Wpm>{`${player.stats.wpm}wpm`}</Styled.Wpm>
                )}
                {(player.stats.position || showReady) && (
                    <Styled.Details>
                        {player.stats.position && (
                            <Styled.Position>
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
                            </Styled.Position>
                        )}
                        {showReady && (
                            <Styled.ReadySwitch $notReady={!player.isReady}>
                                <div>{player.isReady ? "READY" : "NOT READY"}</div>
                            </Styled.ReadySwitch>
                        )}
                    </Styled.Details>
                )}
            </Styled.Player>
        </Styled.PlayerWrapper>
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
