export const matchFirst = (regex, text) => {
    const match = regex.exec(text);
    regex.lastIndex = 0;
    return match;
};
