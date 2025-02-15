import { Ship } from "./Ship";
import { str2Node } from "./utils";

import "../css/Gameboard.css";

export class ColoredShip extends Ship {
    constructor(length, name, color, hidden = false) {
        super(length, name);
        this.color = color;
        this.hidden = hidden;
    }
}

export const createGameboard = (board) => {
    const gridSize = board.size + 1;

    const generateGrid = () => {
        let letters = Array.from(Array(gridSize).keys());
        letters = letters.map((i) => {
            return String.fromCharCode(i + "A".charCodeAt(0));
        });

        const squares = [];

        for (let i = 0; i < gridSize ** 2; i++) {
            const squareHtml = /*html*/ `
                <div class="square"></div>
            `;
            const squareNode = str2Node(squareHtml);

            const isColHeader = i < gridSize && i !== 0;
            const isRowHeader = i % gridSize == 0 && i !== 0;
            if (isRowHeader || isColHeader || i === 0) {
                squareNode.classList.add("header");
                if (isRowHeader) {
                    const rowHeaderTxt = str2Node(/*html*/ `
                        <p>${Math.floor(i / gridSize)}</p>
                    `);
                    squareNode.classList.add("rowHeader");
                    squareNode.appendChild(rowHeaderTxt);
                } else if (isColHeader) {
                    const colHeaderTxt = str2Node(
                        /*html*/ `<p>${letters[i - 1]}</p>`
                    );
                    squareNode.classList.add("colHeader");
                    squareNode.appendChild(colHeaderTxt);
                }
            } else {
                // Shift index back one row and one column
                const row = Math.floor(i / gridSize) - 1;
                const col = (i % gridSize) - 1;
                const coord = [row, col];
                const [ship, hit] = board.shipAt(coord);

                if (ship !== null && !ship.hidden) {
                    squareNode.style.backgroundColor = ship.color;
                    squareNode.classList.add("ship");
                    squareNode.setAttribute("data-ship", ship.name);
                }
                squareNode.setAttribute("data-row", row);
                squareNode.setAttribute("data-col", col);
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

    return {
        render,
        board,
    };
};
