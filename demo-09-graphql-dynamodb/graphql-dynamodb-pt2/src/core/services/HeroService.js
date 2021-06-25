const BaseService = require("./BaseService");

class HeroService extends BaseService {
  constructor({ repository }) {
    super({ repository });
  }
}

module.exports = HeroService;
