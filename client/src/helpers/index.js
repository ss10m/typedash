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

export { longestCommonSubstring, handleResponse };
