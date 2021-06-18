"use strict";

const settings = require("./config/settings");
const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuid } = require("uuid");

const { DynamoDB } = require("aws-sdk");

const dynamoDB = new DynamoDB.DocumentClient();

class Handler {
  static async main(event) {
    console.log("At", new Date().toISOString(), JSON.stringify(event, null, 2));

    const { data } = await axios.get(settings.commitMessageUrl);
    const $ = cheerio.load(data);

    const [commitMessage] = await $("#content").text().trim().split("\n");

    const params = {
      TableName: settings.dbTableName,
      Item: {
        commitMessage,
        id: uuid(),
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();
    console.log("Process finished at", new Date().toISOString());

    return {
      statusCode: 200,
    };
  }
}

module.exports = {
  scheduler: Handler.main,
};
