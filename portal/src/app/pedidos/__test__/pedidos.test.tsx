import {describe, expect, it} from 'vitest'


const miFuncion = "123"

describe('fizzbusz', ():void => {
    it('should be a function', () => {
        expect(typeof miFuncion).toBe('string')
    })
})