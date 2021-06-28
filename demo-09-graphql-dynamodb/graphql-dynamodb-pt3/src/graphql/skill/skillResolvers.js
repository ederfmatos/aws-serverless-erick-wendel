const resolvers = {
  // GET
  Query: {
    async getSkill(root, args, context, info) {
      return "Hello World";
    },
  },
  //   POST
  Mutation: {
    async createSkill(root, args, context, info) {
      return "Hello World";
    },
  },
};

module.exports = resolvers;
