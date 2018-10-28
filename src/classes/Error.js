export default class Error {
  constructor() {
    this.errors = {};
  }

  get(field) {
    if(this.errors[field]) {
      return this.errors[field];
    }
  }

  record(errors) {
    this.errors = errors;
  }

  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  clear(field) {
    if(field) {
      delete this.errors[field];
      return;
    }

    this.errors = {};
  }
}
