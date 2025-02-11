import { assertPosInteger } from "./utils";
import { Ship } from "./Ship";

export class Gameboard {
    #size;
    #board = [];
    #ships = [];

    /*
        Creates a (size x size) board where every cell contains a [ship, hit] state.
        By default, each cell is initialized with [null, false], meaning every cell
        does not contain a ship and has not been hit.
    */
    constructor(size) {
        assertPosInteger(size, "Gameboard size must be a positive integer");
        this.#size = size;

        for (let i = 0; i < size; i++) {
            this.#board.push([]);
            for (let j = 0; j < size; j++) {
                this.#board[i].push([null, false]);
            }
        }
    }

    get size() {
        return this.#size;
    }

    // Check if the given ship collides with another ship on the board
    #hasCollisions(ship, coord, vertical) {
        const start = coord;

        for (let i = 0; i < ship.length; i++) {
            const shipCoord = vertical
                ? [start[0] + i, start[1]]
                : [start[0], start[1] + i];

            const [ship, _] = this.shipAt(shipCoord);
            if (ship !== null) {
                return true;
            }
        }

        return false;
    }

    /*
        Throws an error if the coord given is not a length 2 array with non-negative integer values.
        Returns whether or not the coordinate falls within the gameboard size.
    */
    validCoord(coord) {
        try {
            if (!(coord instanceof Array) || coord.length !== 2) {
                throw new TypeError("Coord must be an array of length 2");
            }

            // Want to include [0,0], [1,0], and [0,1] as valid coords
            coord.forEach((n) => {
                assertPosInteger(
                    n + 1,
                    "Coordinate must have non-negative integers"
                );
            });
        } catch (error) {
            return false;
        }

        const validRow = coord[0] >= 0 && coord[0] < this.#size;
        const validCol = coord[1] >= 0 && coord[1] < this.#size;
        return validRow && validCol;
    }

    receiveAttack(coord) {
        if (!this.validCoord(coord)) {
            throw new RangeError("Invalid coordinate");
        }

        // Update the ship state if necessary
        const [ship, hit] = this.shipAt(coord);
        if (ship !== null && !hit) {
            ship.hit();
        }

        // Update the board state
        const [r, c] = coord;
        this.#board[r][c][1] = true;
    }
    /*
        Returns the ship object along with the ship hit status
        at the given coordinate: [ship, shipHit].
    */
    shipAt(coord) {
        if (!this.validCoord(coord)) {
            throw new RangeError("Invalid coordinate");
        }

        const [r, c] = coord;
        const shipState = this.#board[r][c];
        return shipState;
    }

    /*
        Places a ship at a given starting coordinate [row, col].
        Ships are placed from either top to bottom (if vertical=true)
        or from left to right (if vertical=false).

        For example, placeShip(Battleship, [0,0], true) places the battleship
        at [0,0], [1,0], [2,0], and [3,0], since the battleship piece is of length 4,
        and placeShip(Battleship, [0,0], false) places the battleship at
        coordinates [0,0], [0,1], [0,2], and [0,3].

        Not being able to place a ship due to length and board size constraints returns false,
        successfully placing a ship returns true. Additionally, ships that are trying to be
        placed which collide with other ships also returns false.
    */
    placeShip(ship, coord, vertical = true) {
        const start = coord;
        const end = vertical
            ? [start[0] + ship.length - 1, start[1]]
            : [start[0], start[1] + ship.length - 1];

        if (!(ship instanceof Ship)) {
            throw new TypeError("Must be given a valid ship object");
        }

        if (
            !this.validCoord(start) ||
            !this.validCoord(end) ||
            this.#hasCollisions(ship, coord, vertical)
        ) {
            return false;
        }

        // Now we're free to update the board state
        let shipCopy = new Ship(ship.length, ship.name);
        const shipState = {
            ship: shipCopy,
            cells: [],
        };

        for (let i = 0; i < ship.length; i++) {
            const [row, col] = vertical
                ? [start[0] + i, start[1]]
                : [start[0], start[1] + i];

            const hitStatus = this.#board[row][col][1];
            this.#board[row][col] = [shipCopy, hitStatus];
            shipState.cells.push([row, col]);
        }
        this.#ships.push(shipState);

        return true;
    }

    allSunk() {
        return this.#ships.every((shipState) => {
            return shipState.ship.isSunk();
        });
    }
}
