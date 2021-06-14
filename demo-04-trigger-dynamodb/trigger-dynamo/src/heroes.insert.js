const uuid = require("uuid");
const Joi = require("@hapi/joi");
const decoratorValidator = require("./util/decoratorValidator");
const globalEnum = require("./util/globalEnum");

class Handler {
  constructor({ dynamoDBService }) {
    this.dynamoDBService = dynamoDBService;
    this.dynamoDBTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      nome: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(20).min(2).required(),
    });
  }

  prepareData(data) {
    const params = {
      TableName: this.dynamoDBTable,
      Item: {
        ...data,
        id: uuid.v4(),
        createdAt: new Date().toISOString(),
      },
    };
    return params;
  }

  async insertItem(params) {
    return this.dynamoDBService.put(params).promise();
  }

  handleSuccess(data) {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  }

  handleError(error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Couldn't create item!!",
    };
  }

  async main(event) {
    try {
      const data = event.body;

      const dbParams = this.prepareData(data);
      await this.insertItem(dbParams);

      return this.handleSuccess(dbParams.Item);
    } catch (error) {
      console.log("Deu ruim:::", error);
      return this.handleError(error);
    }
  }
}

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const handler = new Handler({
  dynamoDBService: dynamoDB,
});

module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  globalEnum.ARG_TYPE.BODY
);
