// https://gist.github.com/AndersDJohnson/4385908
export function setIntervalSync(callback, delay) {
    let intervalFunction, timeoutId;

    const clear = function () {
        clearTimeout(timeoutId);
    };

    intervalFunction = function () {
        callback().then(() => {
            timeoutId = setTimeout(intervalFunction, delay);
        });
    }

    timeoutId = setTimeout(intervalFunction, delay);
    return clear;
}