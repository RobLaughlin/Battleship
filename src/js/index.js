import { createGameboard } from "./Gameboard.component";
import { ColoredShip } from "./Gameboard.component";
import { randrangeInt, str2Node } from "./utils";
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

/* 
    Determines the winner between two players.
    Returns 0 if there is no winner, 1 if p1 is the winner and 2 if p2 is the winner.
*/

function determineWinner(player1, player2) {
    const b1Sunk = player1.player.board.allSunk();
    const b2Sunk = player2.player.board.allSunk();
    if (!b1Sunk && !b2Sunk) {
        return 0;
    }

    return Number(b1Sunk) + 1;
}

function renderPlayers(p1, p2) {
    const winner = determineWinner(p1, p2);
    const newP1Node = p1.render();
    const newP2Node = p2.render();
    const p1name = newP1Node.querySelector(".name");
    const p2name = newP2Node.querySelector(".name");

    if (winner) {
        p1name.classList.add(winner === 1 ? "winner" : "loser");
        p2name.classList.add(winner === 2 ? "winner" : "loser");
    } else {
        const newP2Squares = newP2Node.querySelectorAll(
            ".square:not([class*='header']):not([class*='hit'])"
        );
        newP2Squares.forEach((square) => {
            square.addEventListener("click", (e) => {
                computerSquareClicked(p1, p2, e);
            });
        });
    }

    const root = document.getElementById("MainContainer");
    root.innerHTML = "";

    root.appendChild(newP1Node);
    root.appendChild(newP2Node);
}
/*
    Gets a random coord of a square that hasn't been hit
*/

function getRandomFreeCoord(board) {
    const coords = [];
    for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
            const coord = [row, col];
            const [_, hit] = board.shipAt(coord);
            if (!hit) {
                coords.push(coord);
            }
        }
    }

    // If there is no coord available
    if (coords.length === 0) {
        return null;
    }

    const i = randrangeInt(0, coords.length - 1);
    return coords[i];
}

function computerSquareClicked(p1, p2, e) {
    const [player, other] = [p1.player, p2.player];

    if (!player.turn || e.target !== e.currentTarget) {
        return;
    }

    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    const coord = [parseInt(row), parseInt(col)];
    player.attack(other, coord);

    // If there's still no winner, let the other player attack
    if (!determineWinner(p1, p2)) {
        other.attack(player, getRandomFreeCoord(player.board));
    }
    renderPlayers(p1, p2);

    // If there's a winner now, make it the other player's turn to
    // disable square selection for p1
    const winner = determineWinner(p1, p2);
    if (winner) {
        player.setTurn(false);
        other.setTurn(true);
        renderPlayers(p1, p2);

        const winnerName = winner === 1 ? player.name : other.name;
        const playAgainNode = str2Node(/*html*/ `
            <div class="playAgainContainer">
                <p>${winnerName} wins! Play again?</p>
                <button class="playAgainBtn">Play Again</button>
            </div>
        `);
        playAgainNode.querySelector(".playAgainBtn");
        playAgainNode.addEventListener("click", () => {
            p1 = createPlayer(new Player(player.name, player.board.size, true));
            p2 = createPlayer(new Player(other.name, other.board.size, false));
            placeRandomShips(GENERATE_SHIPS(), p1.player.board, false);
            placeRandomShips(GENERATE_SHIPS(), p2.player.board, true);
            renderPlayers(p1, p2);
        });

        const mainContainer = document.querySelector("#MainContainer");
        mainContainer.appendChild(playAgainNode);
    }
}

function main() {
    const p1 = createPlayer(new Player("Player", GAMEBOARD_SIZE, true));
    const p2 = createPlayer(new Player("Computer", GAMEBOARD_SIZE, false));

    placeRandomShips(GENERATE_SHIPS(), p1.player.board, false);
    placeRandomShips(GENERATE_SHIPS(), p2.player.board, true);
    renderPlayers(p1, p2);
}
main();
