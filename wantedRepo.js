class wantedRepo {
  constructor() {
    this._data = new Set();
    this._reverseIndex = new Map();
  }

  add(fuzzyPlate, wantedPlate) {
    this._reverseIndex.set(fuzzyPlate, wantedPlate);
  }

  // add(plate) {
  //   if (Array.isArray(plate)) {
  //     plate.forEach((aPlate) => {
  //       this._data.add(aPlate);
  //     });
  //   } else {
  //     this._data.add(plate);
  //   }
  // }

  get() {
    return this._reverseIndex;
  }

  getOne(plate) {
    return this._reverseIndex.get(plate);
  }

  // get() {
  //   return this._data;
  // }

  has(plate) {
    return this._reverseIndex.has(plate);
  }

  // has(plate) {
  //   return this._data.has(plate);
  // }

  size() {
    return this._reverseIndex.size;
  }

  // size() {
  //   return this._data.size;
  // }

  clear() {
    this._reverseIndex.clear();
  }

  // clear() {
  //   this._data.clear();
  // }
}

const wantedRepoInstance = new wantedRepo();
Object.freeze(wantedRepoInstance);

export default wantedRepoInstance;
