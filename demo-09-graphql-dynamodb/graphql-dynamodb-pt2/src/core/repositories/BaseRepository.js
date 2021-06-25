const { promisify } = require("util");

class BaseRepository {
  constructor({ schema }) {
    this.schema = schema;
  }

  create(item) {
    return promisify(this.schema.create)(item);
  }

  findById(id) {
    return this.schema.query({ id: { eq: id } }).exec();
  }

  findAll(query) {
    return this.schema.scan(query).exec();
  }
}

module.exports = BaseRepository;
