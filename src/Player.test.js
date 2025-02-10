import { test, describe, expect } from "@jest/globals";
import { Player } from "./Player";

function testPlayerObject() {
    test("Player ID must be a non-negative integer", () => {
        expect(() => {
            new Player(1.1);
        }).toThrow(TypeError);
        expect(() => {
            new Player(-1);
        }).toThrow(RangeError);
        expect(() => {
            new Player("s");
        }).toThrow(TypeError);
        expect(() => {
            new Player(0);
        }).not.toThrow(Error);
        expect(() => {
            new Player(1);
        }).not.toThrow(Error);
    });
}
describe("Player object tests", testPlayerObject);
