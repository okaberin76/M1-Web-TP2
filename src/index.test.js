const fs = require('fs').promises;

import { Data, version } from '.';

let data;
beforeAll(async () => {
  data = await fs.readFile('./resources/sensors_data.json', {
    encoding: 'utf8',
  });
  data = JSON.parse(data);
});

describe('Sensor model tests', () => {
  describe('Dummy tests', () => {
    test('data is loaded with 6 elements', () => {
      expect(data.length).toBe(6);
    });
    test('version number from the model', () => {
      expect(version()).toBe('1.0.0');
    });
  });

  describe('Tests class Data', () => {
    test('Data is initialized', () => {
      let expected = new Data(data[0].data.values);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Data.prototype);
    });
    test('Data: get()', () => {
      let expected = new Data(data[0].data.values);
      expect(expected.getValues).toEqual([23, 23, 22, 21, 23, 23, 23, 25, 25]);
    });
    test('Data: set()', () => {
      let expected = new Data(data[0].data.values);
      expected.setValues = 42;
      expect(expected.getValues).toEqual(42);
    });
    test('Data: set() an array of numbers', () => {
      let expected = new Data(data[0].data.values);
      let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expected.setValues = array;
      expect(expected.getValues).toEqual(array);
    });
    test('Data: set() an array of String', () => {
      let expected = new Data(data[0].data.values);
      let array = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      expect(() => (expected.setValues = array)).toThrow('The value(s) can only be a number or an array of numbers');
    });
    test('Data: set() an array of numbers and String', () => {
      let expected = new Data(data[0].data.values);
      let array = [1, '2', '3', 4, '5', '6', '7', 8, '9'];
      expect(() => (expected.setValues = array)).toThrow('The value(s) can only be a number or an array of numbers');
    });
  });
});
