export const findExactWords = (text) => {
    if (text[0] !== '/') {
        throw new Error('Incorrectly formatted input text.')
    }
    let retWords = [];
    let buildWord = '';
    for (let i = 1; i < text.length; i++) {
        if (text[i] === '/') {
            retWords.push(buildWord);
            buildWord = '';
        } else buildWord += text[i];
    }

    return retWords;
}