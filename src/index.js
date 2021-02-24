export const version = () => '1.0.0';

const Enum = require('enum');
const sensorType = new Enum(['TEMPERATURE', 'HUMIDITY', 'LIGHT', 'SWITCH', 'DOOR', 'FAN_SPEED']);

export class Sensor {
  #id;
  #name;
  #dataType;

  constructor(id, name, dataType) {
    if (!(dataType in sensorType)) {
      throw new Error('Error ! The type of this sensor is unknown');
    }
    this.#id = id;
    this.#name = name;
    this.#dataType = dataType;
  }

  get getId() {
    return this.#id;
  }

  get getName() {
    if(typeof this.#name != 'string') {
      this.#name = this.#name.toString();
    }
    return this.#name;
  }

  get getDataType() {
    return this.#dataType;
  }

  set setId(id) {
    if (typeof id !== 'number') {
      throw new Error('The id can only be a number !');
    } else {
      this.#id = id;
    }
  }

  set setName(name) {
    this.#name = name;
  }

  set setDataType(data) {
    this.#dataType = data;
  }
}

export class Data {
  constructor() {

  }
}

export class Datum extends Data {
  #values

  constructor(values) {
    super();
    this.#values = values;
  }

  get getDatumValues() {
    return this.#values;
  }

  set setDatumValues(values) {
    if(typeof values !== 'number') {
      throw new Error('The value(s) can only be a number');
    }
    this.#values = values;
  }
}

export class TimeSeries extends Data {
  #values
  #labels

  constructor(values, labels) {
    super();
    this.#values = values;
    this.#labels = labels;
  }

  get getTSValues() {
    if(!(this.#values instanceof Array)) {
      this.#values = [this.#values];
    }
    return this.#values;
  }

  set setTSValues(values) {
    if(values instanceof Array) {
      let result = values.filter(value => typeof value === 'number');
      if(result.length !== values.length) {
        throw new Error('The value(s) can only be an array of numbers');
      }
      this.#values = result;
    } else {
      throw new Error('The value(s) can only be an array of numbers');
    }
  }

  get getTSLabels() {
    if(!(this.#labels instanceof Array)) {
      this.#labels = [this.#labels];
    }
    return this.#labels;
  }

  set setTSLabels(labels) {
    this.#labels = labels;
  }

  set setTSData({values, labels}) {
    if(values instanceof Array && labels instanceof Array) {
      if(values.length !== labels.length) {
        throw new Error('Error of length ! Not the same amount of labels and values');
      }
    }
    this.setTSValues = values;
    this.setTSLabels = labels;
  }
}

export class Temperature extends Sensor {
  #unity
  #data

  TYPE = {
    CELSIUS : 'Celsius',
    FAHRENHEIT : 'Fahrenheit',
  };

  constructor(id, name, type, data, unity) {
    if(type !== sensorType.get('TEMPERATURE').toString()) {
      throw new Error('Bad type !');
    }
    super(id, name, type, data);
    this.#data = new TimeSeries(data);
    this.#unity = unity;
  }

  get getUnity() {
    return this.#unity;
  }

  set setUnity(unity) {
    this.#unity = unity;
  }

  isCelsius() {
    return this.#unity === this.TYPE.CELSIUS;
  }

  isFahrenheit() {
    return this.#unity === this.TYPE.FAHRENHEIT;
  }

  convertToCelsius(value) {
    return Math.round((value - 32) * (5 / 9));
  }

  convertToFahrenheit(value) {
    return Math.round((value * (9 / 5)) + 32);
  }

  get getAverageTemp() {
    return Math.round(this.#data.getTSValues[this.#data.getTSValues.length - 1].values.reduce((a, b, i) => (a * i + b) / (i + 1)));
  }

  get getAllTemp() {
    return this.#data.getTSValues[this.#data.getTSValues.length - 1].values;
  }
}
