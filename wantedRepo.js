class wantedRepo {
  constructor() {
    this._reverseIndex = new Map();
  }

  add(fuzzyPlate, wantedPlate) {
    this._reverseIndex.set(fuzzyPlate, wantedPlate);
  }

  get() {
    return this._reverseIndex;
  }

  getOne(plate) {
    return this._reverseIndex.get(plate);
  }

  has(plate) {
    return this._reverseIndex.has(plate);
  }

  size() {
    return this._reverseIndex.size;
  }

  clear() {
    this._reverseIndex.clear();
  }
}

const wantedRepoInstance = new wantedRepo();
Object.freeze(wantedRepoInstance);

export default wantedRepoInstance;
