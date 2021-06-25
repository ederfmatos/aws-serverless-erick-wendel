class BaseService {
  constructor({ repository }) {
    this.repository = repository;
  }

  async create(item) {
    return this.repository.create(item);
  }

  async findById(id) {
    return this.repository.findById(id);
  }

  async findAll(query) {
    return this.repository.findAll(query);
  }
}

module.exports = BaseService;
