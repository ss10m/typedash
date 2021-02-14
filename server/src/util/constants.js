const STATE = {
    PREGAME: "PREGAME",
    COUNTDOWN: "COUNTDOWN",
    PLAYING: "PLAYING",
    POSTGAME: "POSTGAME",
};

const ROUND = {
    // TIME: 120000,
    // COUNTDOWN: 10000,
    TIME: 60000,
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

export { STATE, ROUND, TEST_TYPE, FIELD_TYPE };
