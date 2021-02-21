// Libraries & utils
import classNames from "classnames";

// Icons
import { FaTrophy } from "react-icons/fa";

// SCSS
import "./Scoreboard.scss";

const Scoreboard = ({ players, socketId }) => {
    if (!players.length) return <div>Waiting for players</div>;

    const dot = String.fromCharCode(183);

    return (
        <div className="players-wrapper">
            <div
                className={classNames("start", {
                    mini: players.length === 1,
                })}
            >
                START
            </div>
            <div className="players">
                {players.map((player) => {
                    return (
                        <div key={player.id} className="player">
                            <div className={classNames("details", { left: player.leftRoom })}>
                                <div className="username">
                                    {player.username}
                                    {player.socketId === socketId && <span>[ME]</span>}

                                    <div
                                        className={classNames("ready", {
                                            not: !player.isReady,
                                        })}
                                    >
                                        {player.isReady ? "READY" : "NOT READY"}
                                    </div>
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
                                        {`  ${dot}  ${player.stats.wpm}wpm`}
                                        {`  ${dot}  ${player.stats.accuracy}%`}
                                    </div>
                                )}
                                {player.stats.wpm && !player.stats.position && (
                                    <div>{`${player.stats.wpm}wpm`}</div>
                                )}
                            </div>
                            <div
                                className="progress"
                                style={{ width: `${player.stats.progress}%` }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flag"></div>
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
