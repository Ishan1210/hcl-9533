import {greet} from '../app.js';
import {test} from 'node:test';
import assert from 'node:assert';

test('greet function should return a greeting message', () => {
    const expected='Hello World';
    const actual = greet("World");

    assert.strictEqual(actual,expected);
})