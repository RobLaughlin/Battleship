import { Gameboard } from "./Gameboard";
import { assertPosInteger } from "./utils";

export class Player {
    #playerId;
    #board;

    constructor(playerId, boardSize = 10) {
        // Assert PID is a non-negative integer
        assertPosInteger(playerId + 1);

        this.#playerId = playerId;
        this.#board = new Gameboard(boardSize);
    }

    get playerId() {
        return this.#playerId;
    }

    receiveAttack(coord) {
        if (!this.#board.validCoord(coord)) {
            this.#board.receiveAttack(coord);
        }

        return this.#board.shipAt(coord);
    }
}
