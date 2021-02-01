const STATE = {
    PREGAME: "PREGAME",
    COUNTDOWN: "COUNTDOWN",
    PLAYING: "PLAYING",
    POSTGAME: "POSTGAME",
};

const ROOM_ACTION = {
    NEXT_ROUND: "NEXT_ROUND",
    START_COUNTDOWN: "START_COUNTDOWN",
    CANCEL_COUNTDOWN: "CANCEL_COUNTDOWN",
};

const ROUND = {
    // TIME: 120000,
    // COUNTDOWN: 10000,
    TIME: 40000,
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

export { STATE, ROOM_ACTION, ROUND, TEST_TYPE, FIELD_TYPE };
