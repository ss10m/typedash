const isEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
};

const longestCommonSubstring = (s1, s2) => {
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1.charAt(i) !== s2.charAt(i)) return i;
    }
    return 0;
};

const handleResponse = (response) => {
    return response.json().then(({ meta, data }) => {
        if (meta.ok) {
            return data;
        } else {
            return Promise.reject(meta);
        }
    });
};

const calcUptime = (startTime, currentTime) => {
    const time = currentTime - new Date(startTime);

    let seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor(time / (1000 * 60));

    if (seconds < 0) {
        return {
            minutes: "00",
            seconds: "00",
        };
    }

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return {
        seconds,
        minutes,
    };
};

export { isEmpty, longestCommonSubstring, handleResponse, calcUptime };
