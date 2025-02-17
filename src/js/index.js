import { createGameboard } from "./Gameboard.component";
import { ColoredShip } from "./Gameboard.component";
import { randrangeInt } from "./utils";
import { Player } from "./Player";

import "../css/index.css";
import { createPlayer } from "./Player.component";

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

function placeRandomShips(ships, board, hideShips) {
    ships.forEach((ship) => {
        ship.hidden = hideShips;
        const vertical = Boolean(randrangeInt(0, 1));
        const validCoords = getValidCoords(board, ship, vertical);
        const coordIdx = randrangeInt(0, validCoords.length - 1);
        const coord = validCoords[coordIdx];
        board.placeShip(ship, coord, vertical);
    });
}

function renderPlayers(p1, p2) {
    const newP1Node = p1.render();
    const newP2Node = p2.render();
    const newP2Squares = newP2Node.querySelectorAll(".square");
    newP2Squares.forEach((square) => {
        square.addEventListener("click", (e) => {
            computerSquareClicked(p1, p2, e);
        });
    });

    const root = document.getElementById("MainContainer");
    root.innerHTML = "";
    root.appendChild(newP1Node);
    root.appendChild(newP2Node);
}

function computerSquareClicked(p1, p2, e) {
    const [player, other] = [p1.player, p2.player];

    if (!player.turn) {
        return;
    }

    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    const coord = [parseInt(row), parseInt(col)];

    player.attack(other, coord);
    renderPlayers(p1, p2);
}

function main() {
    const p1 = createPlayer(new Player("You", GAMEBOARD_SIZE, true));
    const p2 = createPlayer(new Player("Computer", GAMEBOARD_SIZE, false));

    placeRandomShips(GENERATE_SHIPS(), p1.player.board, false);
    placeRandomShips(GENERATE_SHIPS(), p2.player.board, true);
    renderPlayers(p1, p2);
}
main();
