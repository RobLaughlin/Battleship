import { createGameboard } from "./Gameboard.component";
import { str2Node } from "./utils";

import "../css/Player.css";

export const createPlayer = (player) => {
    const board = createGameboard(player.board);

    const render = () => {
        const node = str2Node(/*html*/ `
            <div class="player">
                <p class="name">${player.name}</p>
            </div>
        `);
        node.appendChild(board.render());

        return node;
    };

    return {
        render,
        player,
        boardComponent: board,
    };
};
