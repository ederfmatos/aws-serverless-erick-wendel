const jwt = require("jsonwebtoken");
const { buildIAMPolicy } = require("./lib/utils");
const JWT_KEY = process.env.JWT_KEY;

const roles = {
  "heroes:list": "/private",
};

const authorizeUser = (scopes, methodArn) => {
  return scopes.find((scope) => ~methodArn.indexOf(roles[scope]));
};

exports.handler = async (event) => {
  const token = event.authorizationToken;

  try {
    const decodedUser = jwt.verify(token, JWT_KEY);

    console.log({ decodedUser });
    const user = decodedUser.user;
    const userId = decodedUser.user.username;

    const isAllowed = authorizeUser(user.scopes, event.methodArn);

    const authorizerContext = {
      user,
    };

    const policyDocument = buildIAMPolicy(
      userId,
      isAllowed ? "Allow" : "Deny",
      event.methodArn,
      authorizerContext
    );

    return policyDocument;
  } catch (error) {
    console.log("Error on authorize::", error);

    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }
};
