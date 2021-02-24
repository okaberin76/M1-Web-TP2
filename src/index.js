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
  #value

  constructor(value) {
    super();
    this.#value = value;
  }

  get getDatumValue() {
    return this.#value;
  }

  set setDatumValue(value) {
    if(typeof value !== 'number') {
      throw new Error('The value(s) can only be a number');
    }
    this.#value = value;
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
    return this.getUnity === this.TYPE.CELSIUS;
  }

  isFahrenheit() {
    return this.getUnity === this.TYPE.FAHRENHEIT;
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

export class Door extends Sensor {
  #state
  #data

  DOOR = {
    OPEN : 0,
    CLOSE : 1,
  };

  constructor(id, name, type, data, state) {
    if(type !== sensorType.get('DOOR').toString()) {
      throw new Error('Bad type !');
    }
    super(id, name, type);
    this.#data = new TimeSeries(data);
    this.#state = state;
  }

  get getState() {
    return this.#state;
  }

  set setState(state) {
    if(state < this.DOOR.OPEN || state > this.DOOR.CLOSE) {
      throw new Error('The number for the state should be 0 or 1 !');
    }
    this.#state = state;
  }

  isOpen() {
    return this.getState === this.DOOR.OPEN;
  }

  isClose() {
    return this.getState === this.DOOR.CLOSE;
  }

  get getAllState() {
    return this.#data.getTSValues[this.#data.getTSValues.length - 1].values;
  }
}

export class Fan extends Sensor {
  #speed;
  #data;

  constructor(id, name, type, data, speed) {
    if(type !== sensorType.get('FAN_SPEED').toString()) {
      throw new Error('Bad type !');
    }
    super(id, name, type);
    this.#speed = speed;
    this.#data = new TimeSeries(data);
  }

  get getSpeed() {
    return this.#speed;
  }

  set setSpeed(speed) {
    if(speed < 0) {
      throw new Error('Negative number !');
    }
    this.#speed = speed;
  }

  get getAllSpeed() {
    return this.#data.getTSValues[this.#data.getTSValues.length - 1].values;
  }

  get getAverageSpeed() {
    return Math.round(this.#data.getTSValues[this.#data.getTSValues.length - 1].values.reduce((a, b, i) => (a * i + b) / (i + 1)));
  }
}

export class Switch extends Sensor {
   #data;
   #state;

  SWITCH = {
    ACTIVATED : 0,
    DESACTIVATED : 1,
  };

  constructor(id, name, type, data, state) {
    if(type !== sensorType.get('SWITCH').toString()) {
      throw new Error('Bad type !');
    }
    super(id, name, type);
    this.#data = new Datum(data);
    this.#state = state;
  }

  get getState() {
    return this.#state;
  }

  set setState(state) {
    if(state < this.SWITCH.ACTIVATED || state > this.SWITCH.DESACTIVATED) {
      throw new Error('The number for the state should be 0 or 1 !');
    }
    this.#state = state;
  }

  isActivated() {
    return this.getState === this.SWITCH.ACTIVATED;
  }

  isDesactivated() {
    return this.getState === this.SWITCH.DESACTIVATED;
  }

  get getAllState() {
    return this.#data.getDatumValue.value;
  }

}
