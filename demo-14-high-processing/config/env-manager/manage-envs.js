const { LexRuntimeV2 } = require("aws-sdk");
const AWS = require("aws-sdk");
const { variables, ssmPrefix } = require("./env");

const SSM = new AWS.SSM({
  region: variables.REGION.value,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function execute() {
  console.log("starting");

  const result = await Promise.all(
    Object.entries(variables).map(async ([key, { value, type }]) => {
      if (!value) Promise.resolve();

      console.log("scheduling insertion");
      await sleep(500);

      return SSM.putParameter({
        Overwrite: true,
        Name: `${ssmPrefix}/${key}`,
        Type: type,
        Value: value,
      }).promise();
    })
  );

  console.log("result", result);
}

execute();
