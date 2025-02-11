import { test, describe, expect } from "@jest/globals";
import { Ship } from "../js/Ship";

function testShip() {
    test("Ship length can only be positive integers", () => {
        expect(() => {
            new Ship("5");
        }).toThrow(TypeError);
        expect(() => {
            new Ship(5.2);
        }).toThrow(TypeError);
        expect(() => {
            new Ship(-5.2);
        }).toThrow(TypeError);
        expect(() => {
            new Ship(-5);
        }).toThrow(RangeError);
        expect(() => {
            new Ship(0);
        }).toThrow(RangeError);
        expect(() => {
            new Ship(1);
        }).not.toThrow(Error);
    });

    test("Ship name must be a string", () => {
        expect(() => {
            new Ship(1, 5);
        }).toThrow(TypeError);
        expect(() => {
            new Ship(1, "");
        }).not.toThrow(TypeError);
        expect(() => {
            new Ship(1, "test");
        }).not.toThrow(TypeError);
        expect(() => {
            new Ship(1);
        }).not.toThrow(TypeError);
    });

    test("Number of hits increases when ship is hit", () => {
        const ship = new Ship(4, "Battleship");
        expect(ship.hits).toBe(0);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test("Ship is sunk when the number of hits >= the ship's length", () => {
        const ship = new Ship(5, "Carrier");
        for (let i = 0; i < ship.length; i++) {
            expect(ship.isSunk()).toBe(false);
            ship.hit();
        }
        expect(ship.isSunk()).toBe(true);

        // Test hitting the ship again
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
}
describe("Ship object tests", testShip);
