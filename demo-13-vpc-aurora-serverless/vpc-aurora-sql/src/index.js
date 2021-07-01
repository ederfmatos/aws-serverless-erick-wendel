const { HeroesSchema, sequelize } = require("./database");
const faker = require("faker");

const handler = async (event) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.log("Error::", error);
    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }

  await HeroesSchema.sync();

  const heroe = await HeroesSchema.create({
    name: faker.name.title(),
    power: faker.name.jobTitle(),
  });

  const heroes = await HeroesSchema.findAll({
    raw: true,
    attributes: ["name", "power", "id"],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        heroes,
        heroe,
      },
      null,
      2
    ),
  };
};

module.exports = { handler };
