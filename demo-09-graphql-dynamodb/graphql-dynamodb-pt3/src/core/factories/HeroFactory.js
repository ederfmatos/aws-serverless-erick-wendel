const HeroRepository = require("../repositories/HeroRepository");
const HeroService = require("../services/HeroService");

async function createInstance() {
  const heroRepository = new HeroRepository();
  const heroService = new HeroService({ repository: heroRepository });

  return heroService;
}

module.exports = { createInstance };
