const resolvers = {
  Hero: {
    async skills(root, args, context) {
      console.log(root.skills);
      const skills = await Promise.all(
        root.skills.map((skill) => context.Skill.findById(skill))
      );

      return skills.reduce((prev, next) => prev.concat(next), []);
    },
  },
  // GET
  Query: {
    async getHero(root, args, context, info) {
      return context.Hero.findAll(args);
    },
  },
  //   POST
  Mutation: {
    async createHero(root, args, context, info) {
      const { id } = await context.Hero.create(args);
      return id;
    },
  },
};

module.exports = resolvers;
