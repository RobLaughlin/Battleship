import { createGameboard } from "./Gameboard.component";

function main() {
    const gb = createGameboard(10);
    const node = gb.render();
    const gbContainer = document.getElementById("MainContainer");
    console.log(node);
    gbContainer.appendChild(node);
}
main();
