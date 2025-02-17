import { Gameboard } from "./Gameboard";

export class Player {
    #board;
    #name = "Player";
    #turn = true;

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

    get turn() {
        return this.#turn;
    }

    attack(player, coord) {
        if (!this.#turn) {
            return false;
        }

        this.#turn = false;
        player.receiveAttack(coord);
        return true;
    }

    receiveAttack(coord) {
        if (this.#turn) {
            return false;
        }

        this.#turn = true;
        this.#board.receiveAttack(coord);
        return true;
    }
}
