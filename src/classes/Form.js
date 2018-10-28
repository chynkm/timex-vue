import Error from './Error'

export default class Form {
  constructor(data) {
    this.originalData = data;

    for(let field in data) {
      this[field] = data[field];
    }

    this.errors = new Error();
  }

  data() {
    let data = Object.assign({}, this);

    delete data.originalData;
    delete data.errors;

    return data;
  }

  submit(requestType, url) {
    return new Promise((resolve, reject) => {
      axios[requestType](url, this.data())
        .then(response => {
          this.onSuccess(response.data);

          resolve(response.data);
        })
        .catch(error => {
          this.onFail(error.response.data);

          reject(error.response.data);
        });
    });
  }

  onSuccess(data) {
    this.reset();
  }

  onFail(errors) {
    if(errors) {
      this.errors.record(errors);
    }
  }

  reset() {
    for(let field in this.originalData) {
      this[field] = '';
    }

    this.errors.clear();
  }
}
