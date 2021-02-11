const fs = require('fs').promises;

import { version, Sensor, Data, DataLabels } from '.';

let data;
beforeAll(async () => {
  data = await fs.readFile('./resources/sensors_data.json', {
    encoding: 'utf8',
  });
  data = JSON.parse(data);
});

describe('Sensor model tests', () => {
  describe('Dummy tests', () => {
    test('data is loaded with 3 elements', () => {
      expect(data.length).toBe(3);
    });
    test('version number from the model', () => {
      expect(version()).toBe('1.0.0');
    });
  });

});
