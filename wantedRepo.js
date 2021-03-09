class wantedRepo {
  constructor() {
    this._data = new Set();
  }

  add(plate) {
    if (Array.isArray(plate)) {
      plate.forEach((aPlate) => {
        this._data.add(aPlate);
      });
    } else {
      this._data.add(plate);
    }
  }

  get() {
    return this._data;
  }

  delete(plate) {
    this._data.delete(plate);
  }

  has(plate) {
    return this._data.has(plate);
  }

  size() {
    return this._data.size;
  }
}

const wantedRepoInstance = new wantedRepo();
Object.freeze(wantedRepoInstance);

export default wantedRepoInstance;
