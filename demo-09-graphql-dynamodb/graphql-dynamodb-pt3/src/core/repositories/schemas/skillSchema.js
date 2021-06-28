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
  value: {
    type: Number,
    required: true,
  },
});

const skillsModel = model(process.env.SKILLS_TABLE, schema);
module.exports = skillsModel;
