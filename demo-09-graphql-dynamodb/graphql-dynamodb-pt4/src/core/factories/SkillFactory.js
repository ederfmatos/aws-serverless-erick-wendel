const SkillRepository = require("../repositories/SkillRepository");
const SkillService = require("../services/SkillService");

async function createInstance() {
  const skillRepository = new SkillRepository();
  const skillService = new SkillService({ repository: skillRepository });

  return skillService;
}

module.exports = { createInstance };
