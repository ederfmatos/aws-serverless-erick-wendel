const BaseRepository = require("./BaseRepository");

const schema = require("./schemas/skillSchema");

class SkillRepository extends BaseRepository {
  constructor() {
    super({ schema });
  }
}

module.exports = SkillRepository;
