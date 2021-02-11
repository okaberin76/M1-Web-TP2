export const version = () => '1.0.0';

const sensorType = Object.freeze(['TEMPERATURE', 'HUMIDITY', 'LIGHT', 'SWITCH', 'DOOR', 'FAN_SPEED']);

export class Sensor {
  #id;
  #name;
  #dataType;

  constructor({ id, name, dataType }) {
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
    return this.#name;
  }

  get dataType() {
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
}

export class Data {
  #values

  constructor(values) {
    this.#values = values;
  }

  get getValues() {
    return this.#values;
  }

  set setValues(values) {
    if(typeof values === 'number') {
      this.#values = values;
    } else if(values instanceof Array) {
      let result = values.filter(value => typeof value === 'number');
      if(result.length !== values.length) {
        result = [];
      }
      this.#values = result;
    } else {
      throw new Error('The value(s) can only be a number or an array of numbers');
    }
  }
}

export class DataLabels extends Data {
  #labels

  constructor(values, labels) {
    super(values);
    this.#labels = labels;
  }

  get getLabels() {
    return this.#labels;
  }

  set setLabels(labels) {
    this.#labels = labels;
  }

  set setData({values, labels}) {
    if(values instanceof Array && labels instanceof Array) {
      if(values.length !== labels.length) {
        throw new Error('Error of length ! Not the same amount of labels and values');
      }
    }
    this.setValues = values;
    this.setLabels = labels;
  }
}
