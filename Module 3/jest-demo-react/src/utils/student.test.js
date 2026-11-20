import {isEligible} from './student';

describe('isEligible',()=>{
    test('should return attendance',()=>{
        expect(isEligible(80)).toBe(80);
    });


    test('should throw error for invalid attendance',()=>{
        expect(()=>isEligible(-10)).toThrow("Invalid attendance value");
        expect(()=>isEligible(110)).toThrow("Invalid attendance value");
    });
});