class wantedRepo {
  constructor() {
    this._data = new Set();
    this._lastTime = undefined;
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

  setLastTime(lastTime) {
    this._lastTime = lastTime;
  }

  getLastTime() {
    return this._lastTime;
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
