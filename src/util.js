// https://gist.github.com/AndersDJohnson/4385908
export function setIntervalSynchronous(func, delay) {
    let intervalFunction, timeoutId, clear;

    clear = function () {
        clearTimeout(timeoutId);
    };
    intervalFunction = async () => {
        await func();
        timeoutId = setTimeout(intervalFunction, delay);
    }

    timeoutId = setTimeout(intervalFunction, delay);
    return clear;
};