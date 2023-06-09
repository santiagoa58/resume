import {
  removeUndefinedOrNullEntries,
  updateObjectWithDefinedValues,
} from '../object_utils';

describe('object_utils', () => {
  describe('updateObjectWithDefinedValues', () => {
    it('should update the object with defined values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const update = { a: undefined, b: 4, c: null };
      const expected = { a: 1, b: 4, c: 3 };
      expect(updateObjectWithDefinedValues(obj, update as any)).toEqual(
        expected
      );
    });
  });
  describe('removeUndefinedOrNullEntries', () => {
    it('should remove undefined or null entries', () => {
      const testSymbol = Symbol('hello');
      const obj = {
        a: 1,
        b: false,
        c: true,
        d: 'hello',
        e: {},
        f: [],
        g: null,
        h: undefined,
        i: 0,
        j: NaN,
        k: '',
        l: testSymbol,
        m: { a: undefined, b: null },
        n: null,
        o: undefined,
      };
      const expected = {
        a: 1,
        b: false,
        c: true,
        d: 'hello',
        e: {},
        f: [],
        i: 0,
        j: NaN,
        k: '',
        l: testSymbol,
        m: { a: undefined, b: null },
      };
      expect(removeUndefinedOrNullEntries(obj)).toEqual(expected);
    });
  });
});
