export function assertPosInteger(n, errMsg) {
    if (typeof n !== "number" || !Number.isInteger(n)) {
        throw new TypeError(errMsg);
    }

    if (n <= 0) {
        throw new RangeError(errMsg);
    }
}
