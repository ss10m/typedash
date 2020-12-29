function longestCommonSubstring(s1, s2) {
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1.charAt(i) !== s2.charAt(i)) return i;
    }
    return 0;
}

export { longestCommonSubstring };
