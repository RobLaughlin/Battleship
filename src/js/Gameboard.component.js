import "../css/Gameboard.css";
import { Gameboard } from "./Gameboard";

const MAX_SIZE = 26;
export const createGameboard = (size) => {
    if (size > MAX_SIZE) {
        throw new RangeError(
            `Size of gameboard component must be <= ${MAX_SIZE}`
        );
    }
    const board = new Gameboard(size);

    const generateGrid = () => {
        let letters = Array.from(Array(size).keys());
        letters = letters.map((i) => {
            return String.fromCharCode(i + "A".charCodeAt(0));
        });

        const squares = [];
        for (let i = 0; i < size ** 2; i++) {
            const isColHeader = i < size && i !== 0;
            const isRowHeader = i % size == 0 && i !== 0;
            const isHeader = isColHeader || isRowHeader;

            const headerClass = isHeader ? "header" : "";
            const colHeaderClass = isColHeader ? "colHeader" : "";
            const rowHeaderClass = isRowHeader ? "rowHeader" : "";
            const colHeaderTxt = isColHeader
                ? /*html*/ `<p>${letters[i - 1]}</p>`
                : "";
            const rowHeaderTxt = isRowHeader
                ? /*html*/ `<p>${Math.floor(i / size)}</p>`
                : "";

            const squareHtml = /*html*/ `
                <div class="square ${headerClass} ${colHeaderClass} ${rowHeaderClass}">
                    ${colHeaderTxt} ${rowHeaderTxt}
                </div>
            `;
            squares.push(squareHtml);
        }
        return squares.join("");
    };

    const render = () => {
        const gameboard = /*html*/ `
            <div class="gameboard">${generateGrid()}</div>
        `;

        const template = document.createElement("template");
        template.innerHTML = gameboard;

        // Create grid
        const node = template.content.querySelector(".gameboard");
        node.style["grid-template-columns"] = `repeat(${size}, 1fr)`;
        node.style["grid-template-rows"] = `repeat(${size}, 1fr)`;

        // Responsively set size of each square
        // node.querySelectorAll(".square").forEach((square) => {
        //     square.style.height = `calc(80vh / ${size})`;
        // });
        return node;
    };

    return {
        render,
    };
};
