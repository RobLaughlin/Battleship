import { Gameboard } from "./Gameboard";

export class Player {
    #board;
    #name = "Player";

    constructor(name, boardSize = 10) {
        if (typeof name !== "string" || name === "") {
            throw new TypeError("name must be a non-empty string");
        }
        this.#name = name;
        this.#board = new Gameboard(boardSize);
    }

    get name() {
        return this.#name;
    }

    get board() {
        return this.#board;
    }
}
