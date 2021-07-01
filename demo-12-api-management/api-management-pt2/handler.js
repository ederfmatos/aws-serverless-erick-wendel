"use strict";

const AWS = require("aws-sdk");
const { format } = require("date-fns");

const apiGateway = new AWS.APIGateway();

const hello = async (event) => {
  return {
    statusCode: 200,
    body: "Hello World",
  };
};

const usage = async (event) => {
  const { from, to, usagePlanId, keyId } = event.queryStringParameters;

  const usage = await apiGateway.getUsage({
    endDate: format(new Date(to), "yyyy-MM-dd"),
    startDate: format(new Date(to), "yyyy-MM-dd"),
    usagePlanId,
    keyId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(usage, null, 2),
  };
};

const usagePlans = async (event) => {
  const response = await apiGateway.getUsagePlans().promise();
  console.log("Getting usage plans", response);

  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2),
  };
};

module.exports = { hello, usage, usagePlans };
