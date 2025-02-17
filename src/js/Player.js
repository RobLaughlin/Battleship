import { Gameboard } from "./Gameboard";

export class Player {
    #board;
    #name = "Player";
    #turn = true;

    constructor(name, boardSize = 10, turn = true) {
        if (typeof name !== "string" || name === "") {
            throw new TypeError("name must be a non-empty string");
        }
        this.#name = name;
        this.#board = new Gameboard(boardSize);
        this.#turn = turn;
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

    setTurn(turn) {
        this.#turn = turn;
    }

    attack(player, coord) {
        if (!this.#turn) {
            return false;
        }

        this.setTurn(false);
        player.receiveAttack(coord);
        return true;
    }

    receiveAttack(coord) {
        if (this.#turn) {
            return false;
        }

        this.setTurn(true);
        this.#board.receiveAttack(coord);
        return true;
    }
}
