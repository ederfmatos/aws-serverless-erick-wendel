"use strict";

const { ApolloServer, gql } = require("apollo-server-lambda");
const setupDynamoDBClient = require("./src/core/util/setupDynamoDB");
setupDynamoDBClient();

const HeroFactory = require("./src/core/factories/HeroFactory");
const SkillFactory = require("./src/core/factories/SkillFactory");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

async function main() {
  console.log("creating factories...");
  const skillFactory = await SkillFactory.createInstance();
  const heroFactory = await HeroFactory.createInstance();

  console.log("inserting skill item");
  const skillId = `${new Date().getTime()}`;

  await skillFactory.create({
    id: skillId,
    name: "mage",
    value: 50,
  });

  console.log("getting skill item");

  const skillItem = await skillFactory.findById(skillId);

  console.log("skillItem", skillItem);

  console.log("getting all skills");
  const skills = await skillFactory.findAll();
  console.log("skills", skills);

  console.log(`\n${"-".repeat(30)}\n`);

  console.log("inserting hero");

  const heroId = `${new Date().getTime()}`;

  await heroFactory.create({
    id: heroId,
    name: "spiderman",
    skills: [skillId],
  });

  console.log("getting skill item");

  const hero = await heroFactory.findById(heroId);

  console.log("hero", hero);

  console.log("getting all heroes");
  const heroes = await heroFactory.findAll();
  console.log("heroes", heroes);

  return {
    statusCode: 200,
    body: JSON.stringify({
      hero: {
        hero,
        heroes,
        heroId,
      },
      skill: {
        skillItem,
        skills,
        skillId,
      },
    }),
  };
}

module.exports.test = main;
