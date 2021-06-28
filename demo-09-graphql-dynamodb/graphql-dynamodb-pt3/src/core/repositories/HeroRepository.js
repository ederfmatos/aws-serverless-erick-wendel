const BaseRepository = require("./BaseRepository");

const schema = require("./schemas/heroSchema");

class HeroRepository extends BaseRepository {
  constructor() {
    super({ schema });
  }
}

module.exports = HeroRepository;
