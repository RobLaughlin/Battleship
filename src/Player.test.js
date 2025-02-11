import { test, describe, expect } from "@jest/globals";
import { Player } from "./Player";

function testPlayerObject() {
    test("Name must be a non-empty string", () => {
        expect(() => {
            new Player(1.1);
        }).toThrow(TypeError);
        expect(() => {
            new Player(-1);
        }).toThrow(TypeError);
        expect(() => {
            new Player("");
        }).toThrow(TypeError);
        expect(() => {
            new Player("name");
        }).not.toThrow(Error);
    });
}
describe("Player object tests", testPlayerObject);
