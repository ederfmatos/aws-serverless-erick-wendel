const dynamoose = require("dynamoose");

function setupDynamoDBClient() {
  if (!process.env.IS_LOCAL) {
    return;
  }

  const host = process.env.LOCALSTACK_HOST;
  const port = process.env.DYNAMODB_PORT;
  console.log("Running DynamoDB locally", host, port);

  dynamoose.aws.sdk.config.update({
    accessKeyId: "DEFAULT_ACCESS_KEY",
    secretAccessKey: "DEFAULT_SECRET_ACCESS_KEY",
  });

  dynamoose.aws.ddb.local(`http://${host}:${port}`);
}

module.exports = setupDynamoDBClient;
