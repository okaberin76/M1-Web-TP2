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

  constructor(values = [], labels = []) {
    super();
    this.#values = values;
    this.#labels = labels;
  }

  get getTimeSeriesValues() {
    if(!(this.#values instanceof Array)) {
      this.#values = [this.#values];
    }
    return this.#values;
  }

  set setTimeSeriesValues(values) {
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

  get getTimeSeriesLabels() {
    if(!(this.#labels instanceof Array)) {
      this.#labels = [this.#labels];
    }
    return this.#labels;
  }

  set setTimeSeriesLabels(labels) {
    this.#labels = labels;
  }

  set setTimeSeriesData({values, labels}) {
    if(values instanceof Array && labels instanceof Array) {
      if(values.length !== labels.length) {
        throw new Error('Error of length ! Not the same amount of labels and values');
      }
    }
    this.setTimeSeriesValues = values;
    this.setTimeSeriesLabels = labels;
  }
}
