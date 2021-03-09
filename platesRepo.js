class plateRepo {
  constructor() {
    this._data = new Map();
  }

  add(LicensePlate, plateObj) {
    this._data.set(LicensePlate, plateObj);
  }

  get(plate) {
    return this._data.get(plate);
  }

  delete(plate) {
    this._data.delete(plate);
  }

  size() {
    return this._data.size;
  }
}

const plateRepoInstance = new plateRepo();
Object.freeze(plateRepoInstance);

export default plateRepoInstance;
