const { v4: uuid } = require("uuid");

class BaseService {
  constructor({ repository }) {
    this.repository = repository;
  }

  async create(item) {
    return this.repository.create({
      ...item,
      id: uuid(),
    });
  }

  async findById(id) {
    return this.repository.findById(id);
  }

  async findAll(query) {
    return this.repository.findAll(query);
  }
}

module.exports = BaseService;
