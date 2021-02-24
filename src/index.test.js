const fs = require('fs').promises;

import { Data, Datum, TimeSeries, Sensor, Temperature, Door, Fan, Switch, Humidity, Light, Pressure, version } from '.';

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
      expect(data.length).toBe(7);
    });
    test('version number from the model', () => {
      expect(version()).toBe('1.0.0');
    });
  });

  describe('Tests class Data', () => {
    test('Data is initialized', () => {
      let expected = new Data();
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Data.prototype);
    });
  });

  describe('Tests class Datum', () => {
    test('Datum is initialized', () => {
      let expected = new Datum(data[0].data.values);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Datum.prototype);
    });
    test('Datum: get()', () => {
      let expected = new Datum(data[0].data.values);
      expect(expected.getDatumValue).toEqual([23, 23, 22, 21, 23, 23, 23, 25, 25]);
    });
    test('Datum: set()', () => {
      let expected = new Datum(data[0].data.values);
      expected.setDatumValue = 42;
      expect(expected.getDatumValue).toEqual(42);
    });
    test('Datum: set() a boolean', () => {
      let expected = new Datum(data[0].data.values);
      expect(() => (expected.setDatumValue = true)).toThrow('The value(s) can only be a number');
    });
  });

  describe('Tests class TimeSeries', () => {
    test('TimeSeries is initialized', () => {
      let expected = new TimeSeries(data[3].data);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(TimeSeries.prototype);
    });
    test('TimeSeries: get()', () => {
      let expected = new TimeSeries(data[2].data.values);
      expect(expected.getTSValues).toEqual(data[2].data.values);
    });
    test('TimeSeries: get() without an array', () => {
      let expected = new TimeSeries(1);
      expect(expected.getTSValues).toEqual([1]);
    });
    test('TimeSeries: set()', () => {
      let expected = new TimeSeries(0, 'test');
      let newData = {values : [1], labels : ['Setting some value with a label']};
      expected.setTSData = newData;
      expect(expected.getTSValues).toEqual(newData.values);
      expect(expected.getTSLabels).toEqual(newData.labels);
    });
    test('TimeSeries: set() without arrays', () => {
      let expected = new TimeSeries(0, 'test');
      let newData = {values : 1, labels : 'Setting some value with a label'};
      expect(() => expected.setTSData = newData).toThrow('The value(s) can only be an array of numbers');
    });
    test('TimeSeries: setValues with an array of multiple type', () => {
      let expected = new TimeSeries(0, 'test');
      let newData = {values : [1, 'test', true, 5, 7]};
      expect(() => expected.setTSData = newData).toThrow('The value(s) can only be an array of numbers');
    });
    test('TimeSeries: set() an array of values and a label', () => {
      let expected = new TimeSeries(data[2].data);
      let newValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let newData = {values : newValues, labels : 'Setting some value with a label'};
      expected.setTSData = newData;
      expect(expected.getTSValues).toEqual(newData.values);
      expect(expected.getTSLabels).toEqual([newData.labels]);
    });
    test('TimeSeries: set() an array of values and an array of label, both with the same length', () => {
      let expected = new TimeSeries(data[2].data);
      let newValues = [];
      let newLabels = [];
      for(let i = 0; i < 5; i++) {
        newValues.push(i);
        newLabels.push('Label: ' + i);
      }
      expected.setTSData = {values: newValues, labels: newLabels};
      expect(expected.getTSValues).toEqual(newValues);
      expect(expected.getTSLabels).toEqual(newLabels);
    });
    test('TimeSeries: set() an array of values and an array of label, both with different length', () => {
      let expected = new TimeSeries(data[2].data);
      let newData = {values : [1, 2, 3, 4, 5, 6, 7, 8, 9], labels : ['A', 'B', 'C']};
      expect(() => expected.setTSData = newData).toThrow('Error of length ! Not the same amount of labels and values');
    });
  });

  describe('Tests class Sensor', () => {
    test('DataSensor is initialized', () => {
      let expected = new Sensor(12, 'test', 'DOOR');
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Sensor.prototype);
    });
    test('DataSensor is initialized with an unknown type', () => {
      expect(() => new Sensor(12, 'test', '?')).toThrow('Error ! The type of this sensor is unknown');
    });
    describe('Sensor: get()', () => {
      test('Sensor: getId', () => {
        expect(new Sensor(data[1].id, data[1].name, data[1].type).getId).toEqual(data[1].id);
      });
      test('Sensor: getName', () => {
        expect(new Sensor(data[1].id, data[1].name, data[1].type).getName).toEqual(data[1].name);
      });
      test('Sensor: getName that\'s not a String', () => {
        expect(new Sensor(data[1].id, 500, data[1].type).getName).toEqual('500');
      });
      test('Sensor: getDataType', () => {
        expect(new Sensor(data[1].id, data[1].name, data[1].type).getDataType).toEqual(data[1].type);
      });
    });
    describe('Sensor: set()', () => {
      test('Sensor: setId', () => {
        let expected = new Sensor(data[1].id, data[1].name, data[1].type);
        expected.setId = 3;
        expect(expected.getId).toEqual(3);
      });
      test('Sensor: setId with something that\'s not a number', () => {
        let expected = new Sensor(data[1].id, data[1].name, data[1].type);
        expect(() => expected.setId = 'test').toThrow('The id can only be a number !');
      });
      test('Sensor: setName', () => {
        let expected = new Sensor(data[1].id, data[1].name, data[1].type);
        expected.setName = 'test';
        expect(expected.getName).toEqual('test');
      });
      test('Sensor: setDataType', () => {
        let expected = new Sensor(data[1].id, data[1].name, data[1].type);
        expected.setDataType = 46;
        expect(expected.getDataType).toEqual(46);
      });
    });
  });

  describe('Tests class Temperature', () => {
    test('Temperature is initialized', () => {
      let expected = new Temperature(data[0], 'Celsius');
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Temperature.prototype);
    });
    test('Temperature is initialized with type = DOOR', () => {
      expect(() => new Temperature(data[1], 'Celsius')).toThrow('Bad type !');
    });
    test('Temperature: getUnity', () => {
      expect(new Temperature(data[0], 'Celsius').getUnity).toEqual('Celsius');
    });
    test('Temperature: setUnity', () => {
      let expected = new Temperature(data[0], 'Celsius');
      expected.setUnity = 'Fahrenheit';
      expect(expected.getUnity).toEqual('Fahrenheit');
    });
    test('Temperature: isCelsius', () => {
      expect(new Temperature(data[0], 'Celsius').isCelsius()).toEqual(true);
    });
    test('Temperature: isFahrenheit', () => {
      expect(new Temperature(data[0], 'Celsius').isFahrenheit()).toEqual(false);
    });
    test('Temperature: convertToCelsius', () => {
      expect(new Temperature(data[0], 'Fahrenheit').convertToCelsius(100)).toEqual(38);
    });
    test('Temperature: convertToFahrenheit', () => {
      expect(new Temperature(data[0], 'Celsius').convertToFahrenheit(38)).toEqual(100);
    });
    test('Temperature: getAverageTemp', () => {
      expect(new Temperature(data[0], 'Celsius').getAverageTemp).toEqual(23);
    });
    test('Temperature: getAllTemp', () => {
      expect(new Temperature(data[0], 'Celsius').getAllTemp).toEqual(data[0].data.values);
    });
  });

  describe('Tests class Door', () => {
    test('Door is initialized', () => {
      let expected = new Door(data[1], 0);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Door.prototype);
    });
    test('Door is initialized with an incorrect type', () => {
      expect(() => new Door(data[3], 0)).toThrow('Bad type !');
    });
    test('Door: getState', () => {
      expect(new Door(data[1], 0).getState).toEqual(0);
    });
    test('Door: setState', () => {
      let expected = new Door(data[1], 0);
      expected.setState = 1;
      expect(expected.getState).toEqual(1);
    });
    test('Door: setState with an invalid number', () => {
      let expected = new Door(data[1], 0);
      expect(() => expected.setState = 5).toThrow('The number for the state should be 0 or 1 !');
    });
    test('Door: isOpen', () => {
      expect(new Door(data[1], 0).isOpen()).toBe(true);
    });
    test('Door: isClose', () => {
      expect(new Door(data[1], 1).isClose()).toEqual(true);
    });
    test('Door: getAllState', () => {
      expect(new Door(data[1], 0).getAllState).toEqual(data[1].data.values);
    });
  });

  describe('Tests class Fan', () => {
    test('Fan is initialized', () => {
      let expected = new Fan(data[2], 1600);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Fan.prototype);
    });
    test('Fan is initialized with an incorrect type', () => {
      expect(() => new Fan(data[3], data[2].data.values)).toThrow('Bad type !');
    });
    test('Fan: getSpeed', () => {
      expect(new Fan(data[2], 1749).getSpeed).toEqual(1749);
    });
    test('Fan: setSpeed', () => {
      let expected = new Fan(data[2], 1500);
      expected.setSpeed = 1400;
      expect(expected.getSpeed).toEqual(1400);
    });
    test('Fan: setSpeed with an invalid number', () => {
      let expected = new Fan(data[2], 1500);
      expect(() => expected.setSpeed = -10).toThrow('Negative number !');
    });
    test('Fan: getAverageSpeed', () => {
      expect(new Fan(data[2], data[2].data.values).getAverageSpeed).toEqual(1775);
    });
    test('Fan: getAllSpeed', () => {
      expect(new Fan(data[2], data[2].data.values).getAllSpeed).toEqual(data[2].data.values);
    });
  });

  describe('Tests class Switch', () => {
    test('Switch is initialized', () => {
      let expected = new Switch(data[3], 0);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Switch.prototype);
    });
    test('Switch is initialized with an incorrect type', () => {
      expect(() => new Switch(data[5], 0)).toThrow('Bad type !');
    });
    test('Switch: getState', () => {
      expect(new Switch(data[3], 0).getState).toEqual(0);
    });
    test('Switch: setState', () => {
      let expected = new Switch(data[3], 0);
      expected.setState = 1;
      expect(expected.getState).toEqual(1);
    });
    test('Switch: setState with an invalid number', () => {
      let expected = new Switch(data[3], 0);
      expect(() => expected.setState = 5).toThrow('The number for the state should be 0 or 1 !');
    });
    test('Switch: isActivated', () => {
      expect(new Switch(data[3], 0).isActivated()).toBe(true);
    });
    test('Switch: isDesactivated', () => {
      expect(new Switch(data[3], 1).isDesactivated()).toEqual(true);
    });
    test('Switch: getAllState', () => {
      expect(new Switch(data[3], data[3].data.value).getAllState).toEqual(data[3].data.value);
    });
  });

  describe('Tests class Humidity', () => {
    test('Humidity is initialized', () => {
      let expected = new Humidity(data[4], 1.14);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Humidity.prototype);
    });
    test('Humidity is initialized with an incorrect type', () => {
      expect(() => new Humidity(data[0], 1.14)).toThrow('Bad type !');
    });
    test('Humidity: getPercentHumidity', () => {
      expect(new Humidity(data[4], 1.14).getPercentHumidity).toEqual(1.14);
    });
    test('Humidity: setPercentHumidity', () => {
      let expected = new Humidity(data[4], 1.14);
      expected.setPercentHumidity = 25.7;
      expect(expected.getPercentHumidity).toEqual(25.7);
    });
      test('Humidity: isHumid', () => {
      expect(new Humidity(data[4], 28.74).isHumid()).toEqual(true);
    });
    test('Humidity: getAverageHumidity', () => {
      expect(new Humidity(data[4], data[4].data.value).getAverageHumidity).toEqual(6);
    });
    test('Humidity: getAllHumidity', () => {
      expect(new Humidity(data[4], data[4].data.value).getAllHumidity).toEqual(data[4].data.values);
    });
  });

  describe('Tests class Light', () => {
    test('Light is initialized', () => {
      let expected = new Light(data[5], 0);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Light.prototype);
    });
    test('Light is initialized with an incorrect type', () => {
      expect(() => new Light(data[1], 0)).toThrow('Bad type !');
    });
    test('Light: getState', () => {
      expect(new Light(data[5], 0).getState).toEqual(0);
    });
    test('Light: setState', () => {
      let expected = new Light(data[5], 0);
      expected.setState = 1;
      expect(expected.getState).toEqual(1);
    });
    test('Light: setState with an invalid number', () => {
      let expected = new Light(data[5], 0);
      expect(() => expected.setState = 5).toThrow('The number for the state should be 0 or 1 !');
    });
    test('Light: isOpen', () => {
      expect(new Light(data[5], 0).isActivated()).toBe(true);
    });
    test('Light: isClose', () => {
      expect(new Light(data[5], 1).isDesactivated()).toEqual(true);
    });
    test('Light: getAllState', () => {
      expect(new Light(data[5], 0).getAllState).toEqual(data[5].data.values);
    });
  });

  describe('Tests class Pressure', () => {
    test('Pressure is initialized', () => {
      let expected = new Pressure(data[6], 1600);
      expect(expected).toBeDefined();
      expect(Object.getPrototypeOf(expected)).toBe(Pressure.prototype);
    });
    test('Pressure is initialized with an incorrect type', () => {
      expect(() => new Pressure(data[3], data[6].data.values)).toThrow('Bad type !');
    });
    test('Pressure: getPressure', () => {
      expect(new Pressure(data[6], 1749).getPressure).toEqual(1749);
    });
    test('Pressure: setPressure', () => {
      let expected = new Pressure(data[6], 454);
      expected.setPressure = 1900;
      expect(expected.getPressure).toEqual(1900);
    });
    test('Pressure: setPressure with an invalid number', () => {
      let expected = new Pressure(data[6], 985);
      expect(() => expected.setPressure = -1156).toThrow('Negative number !');
    });
    test('Pressure: getAveragePressure', () => {
      expect(new Pressure(data[6], data[6].data.values).getAveragePressure).toEqual(1811);
    });
    test('Pressure: getAllPressure', () => {
      expect(new Pressure(data[6], data[6].data.values).getAllPressure).toEqual(data[6].data.values);
    });
  });
});
