import { createGameboard } from "./Gameboard.component";
import { ColoredShip } from "./Gameboard.component";
import { randrangeInt } from "./utils";

const GAMEBOARD_SIZE = 10;
const GENERATE_SHIPS = () => {
    return [
        new ColoredShip(5, "Carrier", "#BFECFF"),
        new ColoredShip(4, "Battleship", "#CDC1FF"),
        new ColoredShip(3, "Cruiser", "#B1C29E"),
        new ColoredShip(3, "Submarine", "#FFCCEA"),
        new ColoredShip(2, "Destroyer", "#DEAA79"),
    ];
};

/*
    Return all valid coords where we are able to put a ship
*/
function getValidCoords(gameboard, ship, vertical) {
    const coords = [];
    const endRow = vertical ? GAMEBOARD_SIZE - ship.length + 1 : GAMEBOARD_SIZE;
    const endCol = vertical ? GAMEBOARD_SIZE : GAMEBOARD_SIZE - ship.length + 1;

    for (let row = 0; row < endRow; row++) {
        for (let col = 0; col < endCol; col++) {
            let shipFound = false;
            for (let i = 0; i < ship.length; i++) {
                const coord = vertical ? [row + i, col] : [row, col + i];
                if (gameboard.shipAt(coord)[0] !== null) {
                    shipFound = true;
                    break;
                }
            }

            if (!shipFound) {
                coords.push([row, col]);
            }
        }
    }

    return coords;
}

function main() {
    const gb = createGameboard(GAMEBOARD_SIZE);
    const board = gb.board;
    GENERATE_SHIPS().forEach((ship) => {
        const vertical = Boolean(randrangeInt(0, 1));
        const validCoords = getValidCoords(board, ship, vertical);
        const coordIdx = randrangeInt(0, validCoords.length - 1);
        const coord = validCoords[coordIdx];
        gb.placeShip(ship, coord, vertical);
    });
    const node = gb.render();
    const gbContainer = document.getElementById("MainContainer");
    gbContainer.appendChild(node);
}
main();
