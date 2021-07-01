const Sequelize = require("sequelize");

const connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const sequelize = new Sequelize(
  connection.database,
  connection.user,
  connection.password,
  {
    host: connection.host,
    dialect: "mysql",
    quoteIdentifiers: false,
  }
);

const Heroes = sequelize.define(
  "Heroes",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    power: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  {
    tableName: "TB_HEROES",
    freezeTableName: false,
    timestamps: false,
  }
);

module.exports = {
  HeroesSchema: Heroes,
  sequelize,
};
