export function assertPosInteger(n, errMsg) {
    if (typeof n !== "number" || !Number.isInteger(n)) {
        throw new TypeError(errMsg);
    }

    if (n <= 0) {
        throw new RangeError(errMsg);
    }
}

export function str2Node(str) {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `${str}`;
    return template.content.firstElementChild;
}

/* 
    Returns a random integer in the range [min, max]
*/
export function randrangeInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
