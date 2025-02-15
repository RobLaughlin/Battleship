import "../css/Gameboard.css";
import { Gameboard } from "./Gameboard";
import { Ship } from "./Ship";
import { str2Node } from "./utils";

const MAX_SIZE = 26;

export class ColoredShip extends Ship {
    constructor(length, name, color) {
        super(length, name);
        this.color = color;
    }
}

export const createGameboard = (size) => {
    if (size > MAX_SIZE) {
        throw new RangeError(
            `Size of gameboard component must be <= ${MAX_SIZE}`
        );
    }
    const board = new Gameboard(size);
    const gridSize = size + 1;

    const generateGrid = () => {
        let letters = Array.from(Array(gridSize).keys());
        letters = letters.map((i) => {
            return String.fromCharCode(i + "A".charCodeAt(0));
        });

        const squares = [];

        for (let i = 0; i < gridSize ** 2; i++) {
            // Determine whether the row and column is a header cell
            const isColHeader = i < gridSize && i !== 0;
            const isRowHeader = i % gridSize == 0 && i !== 0;
            const isHeader = isColHeader || isRowHeader || i === 0;

            const headerClass = isHeader ? "header" : "";
            const colHeaderClass = isColHeader ? "colHeader" : "";
            const rowHeaderClass = isRowHeader ? "rowHeader" : "";
            const colHeaderTxt = isColHeader
                ? /*html*/ `<p>${letters[i - 1]}</p>`
                : "";
            const rowHeaderTxt = isRowHeader
                ? /*html*/ `<p>${Math.floor(i / gridSize)}</p>`
                : "";

            const squareHtml = /*html*/ `
                <div class="square ${headerClass} ${colHeaderClass} ${rowHeaderClass}">
                    ${colHeaderTxt} ${rowHeaderTxt}
                </div>
            `;
            const squareNode = str2Node(squareHtml);
            if (!isHeader) {
                // Shift index back one row and one column
                const row = Math.floor(i / gridSize) - 1;
                const col = (i % gridSize) - 1;
                const coord = [row, col];
                const [ship, hit] = board.shipAt(coord);

                if (ship !== null) {
                    squareNode.style.backgroundColor = ship.color;
                }
            }
            squares.push(squareNode);
        }
        return squares;
    };

    const render = () => {
        const gameboard = str2Node(/*html*/ `
            <div class="gameboard"></div>
        `);

        const squares = generateGrid();
        squares.forEach((square) => {
            gameboard.appendChild(square);
        });

        gameboard.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;
        gameboard.style["grid-template-rows"] = `repeat(${gridSize}, 1fr)`;

        return gameboard;
    };

    const placeShip = (ship, coord, vertical) => {
        board.placeShip(ship, coord, vertical);
    };

    return {
        render,
        placeShip,
        board,
    };
};
