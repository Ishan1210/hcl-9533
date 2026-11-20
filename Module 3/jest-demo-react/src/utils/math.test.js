import {add, subtract, multiply, divide} from './math';

describe("Math utility testing", () => {
    test("should add two numbers", () => {
        expect(add(10, 3)).toBe(13);
    });

    test("should subtract two numbers", () => {
        expect(subtract(10, 3)).toBe(7);
    });

    test("should multiply two numbers", () => {
        expect(multiply(10, 3)).toBe(30);
    });
});

