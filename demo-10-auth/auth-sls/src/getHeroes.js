"use strict";

module.exports.public = async (event) => {
  console.log("Requesting public route::", new Date().toISOString());

  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 1,
          name: "Capitão Caverna",
          power: "Marretada",
        },
      ],
      null,
      2
    ),
  };
};

module.exports.private = async (event) => {
  console.log("Requesting private route::", new Date().toISOString());

  console.log("User::", event.requestContext.authorizer);

  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 10,
          name: "Scooby Doo",
          power: "Comer biscoitos scooby",
        },
      ],
      null,
      2
    ),
  };
};
