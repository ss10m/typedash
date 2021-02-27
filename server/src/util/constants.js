const STATE = {
    PREGAME: "PREGAME",
    COUNTDOWN: "COUNTDOWN",
    PLAYING: "PLAYING",
    POSTGAME: "POSTGAME",
};

const ROUND = {
    // TIME: 120000,
    // COUNTDOWN: 10000,
    TIME: 120000,
    COUNTDOWN: 4000,
};

const TEST_TYPE = {
    VALID: "VALID",
    AVAILABLE: "AVAILABLE",
    EXISTS: "EXISTS",
};

const FIELD_TYPE = {
    USERNAME: "USERNAME",
    EMAIL: "EMAIL",
    PASSWORD: "PASSWORD",
};

const RESULT_TYPE = {
    TOP: "TOP",
    RECENT: "RECENT",
    PLAYER_TOP: "PLAYER_TOP",
    PLAYER_RECENT: "PLAYER_RECENT",
};

export { STATE, ROUND, TEST_TYPE, FIELD_TYPE, RESULT_TYPE };
