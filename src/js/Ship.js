import { assertPosInteger } from "./utils";

export class Ship {
    #name;
    #length;
    #hits = 0;

    constructor(length, name = "Ship") {
        assertPosInteger(length, "Length must be a positive integer");

        if (typeof name !== "string") {
            throw new TypeError("Name must be a string.");
        }

        this.#length = length;
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    get length() {
        return this.#length;
    }

    get hits() {
        return this.#hits;
    }

    hit() {
        this.#hits++;
    }

    isSunk() {
        return this.#hits >= this.#length;
    }
}
