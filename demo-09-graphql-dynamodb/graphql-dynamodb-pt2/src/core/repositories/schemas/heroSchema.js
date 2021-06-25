const { Schema, model } = require("dynamoose");

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
  },
  name: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    schema: [String],
    required: true,
  },
});

const heroModel = model(process.env.HEROES_TABLE, schema);
module.exports = heroModel;
