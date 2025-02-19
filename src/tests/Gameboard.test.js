import { test, describe, expect } from "@jest/globals";
import { Gameboard } from "../js/Gameboard";
import { Ship } from "../js/Ship";

function testGameboard() {
    test("Gameboard size must be a positive integer", () => {
        expect(() => {
            new Gameboard("5");
        }).toThrow(TypeError);
        expect(() => {
            new Gameboard(5.2);
        }).toThrow(TypeError);
        expect(() => {
            new Gameboard(-5.2);
        }).toThrow(TypeError);
        expect(() => {
            new Gameboard(-5);
        }).toThrow(RangeError);
        expect(() => {
            new Gameboard(0);
        }).toThrow(RangeError);
        expect(() => {
            new Gameboard(1);
        }).not.toThrow(Error);
    });

    test("Coordinate validation works", () => {
        const gb = new Gameboard(10);
        expect(gb.validCoord("s")).toBe(false);
        expect(gb.validCoord(null)).toBe(false);
        expect(gb.validCoord([])).toBe(false);
        expect(gb.validCoord([1])).toBe(false);
        expect(gb.validCoord([1, 1.5])).toBe(false);
        expect(gb.validCoord([1, -1])).toBe(false);
        expect(gb.validCoord([0, 0])).toBe(true);
        expect(gb.validCoord([10, 10])).toBe(false);
    });

    describe("Placing ships", () => {
        test("Not giving a valid ship object throws an error", () => {
            const gb = new Gameboard(10);
            expect(() => {
                gb.placeShip("S", [0, 0]);
            }).toThrow(TypeError);
            expect(() => {
                gb.placeShip(5, [0, 0]);
            }).toThrow(TypeError);
            expect(() => {
                gb.placeShip(new Ship(4, "Battleship"), [0, 0]);
            }).not.toThrow(Error);
        });

        test("Placing a ship not within range or collision with another ship returns false", () => {
            const gb = new Gameboard(10);
            const battleship = new Ship(4, "Battleship");
            const cruiser = new Ship(5, "Cruiser");

            expect(gb.placeShip(battleship, [11, 0])).toBe(false);
            expect(gb.placeShip(battleship, [11, 11])).toBe(false);
            expect(gb.placeShip(battleship, [0, 10])).toBe(false);
            expect(gb.placeShip(battleship, [0, 0])).toBe(true);

            // Collisions
            expect(gb.placeShip(cruiser, [0, 0])).toBe(false);
            expect(gb.placeShip(cruiser, [0, 0], false)).toBe(false);

            // Should return true from being placed horizontally
            expect(gb.placeShip(cruiser, [0, 1], false)).toBe(true);
        });
    });

    describe("Retrieving ships", () => {
        test("throws an error if the coordinate is invalid", () => {
            const gb = new Gameboard(10);
            expect(() => {
                gb.shipAt([-1, 0]);
            }).toThrow(RangeError);
            expect(() => {
                gb.shipAt([10, 0]);
            }).toThrow(RangeError);
            expect(() => {
                gb.shipAt([10, 10]);
            }).toThrow(RangeError);
            expect(() => {
                gb.shipAt([0, 0]);
            }).not.toThrow(Error);
        });

        test("returns the updated state properly", () => {
            const gb = new Gameboard(5);
            let ship = new Ship(4, "Battleship");

            expect(gb.shipAt([0, 0])).toStrictEqual([null, false]);
            gb.placeShip(ship, [0, 0], true);
            const [shipCopy, _] = gb.shipAt([0, 0]);
            ship = shipCopy;

            expect(gb.shipAt([0, 0])).toStrictEqual([ship, false]);

            // Cell gets attacked and hits the ship
            gb.receiveAttack([0, 0]);
            expect(gb.shipAt([0, 0])).toStrictEqual([ship, true]);
            expect(gb.shipAt([1, 0])).toStrictEqual([ship, false]);
            expect(gb.shipAt([2, 0])).toStrictEqual([ship, false]);
            expect(gb.shipAt([3, 0])).toStrictEqual([ship, false]);
            expect(ship.hits).toBe(1);

            // Just misses the ship
            gb.receiveAttack([4, 0]);
            expect(gb.shipAt([0, 0])).toStrictEqual([ship, true]);
            expect(gb.shipAt([1, 0])).toStrictEqual([ship, false]);
            expect(gb.shipAt([2, 0])).toStrictEqual([ship, false]);
            expect(gb.shipAt([3, 0])).toStrictEqual([ship, false]);
            expect(gb.shipAt([4, 0])).toStrictEqual([null, true]);
            expect(ship.hits).toBe(1);

            // Attacked in the same spot, hits shouldn't go up
            gb.receiveAttack([0, 0]);
            expect(gb.shipAt([0, 0])).toStrictEqual([ship, true]);
            expect(ship.hits).toBe(1);

            // Attacked in a different spot, hits should go up
            gb.receiveAttack([3, 0]);
            expect(gb.shipAt([3, 0])).toStrictEqual([ship, true]);
            expect(ship.hits).toBe(2);
        });
    });

    test("Receiving attacks is handled correctly", () => {
        const gb = new Gameboard(10);
        gb.receiveAttack([6, 0]);
        expect(gb.shipAt([6, 0])).toStrictEqual([null, true]);

        // Adding a ship after we attack a square
        let ship = new Ship(4, "Battleship");
        gb.placeShip(ship, [6, 0], true);

        const [shipCopy, _] = gb.shipAt([9, 0]);
        ship = shipCopy;

        expect(gb.shipAt([6, 0])).toStrictEqual([ship, true]);
        expect(gb.shipAt([7, 0])).toStrictEqual([ship, false]);
        expect(gb.shipAt([8, 0])).toStrictEqual([ship, false]);
        expect(ship.hits).toBe(0);

        // Attacking the ship after the square has been attacked already
        gb.receiveAttack([6, 0]);
        expect(gb.shipAt([6, 0])).toStrictEqual([ship, true]);
        expect(gb.shipAt([7, 0])).toStrictEqual([ship, false]);
        expect(gb.shipAt([8, 0])).toStrictEqual([ship, false]);
        expect(ship.hits).toBe(0);
    });

    test("Properly reports when all ships have been sunk", () => {
        const gb = new Gameboard(10);
        gb.placeShip(new Ship(4, "Battleship"), [4, 4]);
        gb.placeShip(new Ship(2, "Destroyer"), [4, 5], false);

        // Destroy the battleship
        for (let i = 4; i < 8; i++) {
            gb.receiveAttack([i, 4]);
            expect(gb.allSunk()).toBe(false);
        }
        let [ship, _] = gb.shipAt([5, 4]);
        expect(ship.isSunk()).toBe(true);

        // Destroy the destroyer
        for (let i = 5; i < 7; i++) {
            gb.receiveAttack([4, i]);
        }
        [ship, _] = gb.shipAt([4, 5]);
        expect(ship.isSunk()).toBe(true);

        // Check if all ships have been sunk
        expect(gb.allSunk()).toBe(true);
    });
}
describe("Gameboard object tests", testGameboard);
