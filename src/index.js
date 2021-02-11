export const version = () => '1.0.0';

const TYPES = Object.freeze(['TEMPERATURE', 'HUMIDITY', 'LIGHT', 'SWITCH', 'DOOR']);

export class Sensor {
  #id;
  #name;
  #dataType;

  constructor({id, name, dataType}) {
    if(!(dataType in TYPES)) {
      throw new Error('Error ! The type of this sensor is unknown');
    }
    this.#id = id;
    this.#name = name;
    this.#dataType = dataType;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get dataType() {
    return this.#dataType;
  }

  set id(val) {
    if (typeof val !== 'number') {
      throw new Error ('The id can only be a number !');
    } else {
      this.#id = val;
    }
  }

  set name(val) {
    this.#name = val;
  }
}
