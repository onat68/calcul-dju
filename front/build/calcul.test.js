const { calculDJU, setSeuilRef } = require("./calculs.js")
const { describe, expect, test } = require("@jest/globals")


describe('calculDJU', () => {
    setSeuilRef(18)
    test('tmin 1 and tmax 15 to equal 16.5', () => {
        expect(calculDJU(1,2)).toBe(16.5)
    })
    test('tmin 20 and tmax 25 to equal 0', () => {
        expect(calculDJU(20,25)).toBe(0)
    })
    test('seuilRef undefined return 999', () => {
        setSeuilRef(999)
        expect(calculDJU(20,25)).toBe(999)
    })
})

describe('extractTemperatures', () => {
    
})
