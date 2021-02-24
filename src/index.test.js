const fs = require('fs').promises;

import { Data, DataLabels, version } from '.';

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

  describe('Tests class DataLabels', () => {
    test('DataLabels is initialized', () => {
      let expected = new DataLabels(data[3].data);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(DataLabels.prototype);
    });
    test('DataLabels: get()', () => {
      let expected = new DataLabels(data[2].data).getValues;
      expect(expected.values).toEqual(data[2].data.values);
    });
    test('DataLabels: set()', () => {
      let expected = new DataLabels(data[2].data);
      let newData = {values : 5, labels : 'Setting new value'};
      expected.setData = newData;
      expect(expected.getValues).toEqual(newData.values);
      expect(expected.getLabels).toEqual(newData.labels);
    });
    test('DataLabels: set() an array values and a label', () => {
      let expected = new DataLabels(data[2].data);
      let newValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let newData = {values : newValues, labels : 'Setting some value with a label'};
      expected.setData = newData;
      expect(expected.getValues).toEqual(newData.values);
      expect(expected.getLabels).toEqual(newData.labels);
    });
    test('DataLabels: set() an array of values and an array of label, both with the same length', () => {
      let expected = new DataLabels(data[2].data);
      let newValues = [];
      let newLabels = [];
      for(let i = 0; i < 5; i++) {
        newValues.push(i);
        newLabels.push('Label: ' + i);
      }
      expected.setData = { values: newValues, labels: newLabels };
      expect(expected.getValues).toEqual(newValues);
      expect(expected.getLabels).toEqual(newLabels);
    });
    test('DataLabels: set() an array of values and an array of label, both with different length', () => {
      let expected = new DataLabels(data[2].data);
      let newData = {values : [1, 2, 3, 4, 5, 6, 7, 8, 9], labels : ['A', 'B', 'C']};
      expect(() => expected.setData = newData).toThrow('Error of length ! Not the same amount of labels and values');
    });
  });
});
