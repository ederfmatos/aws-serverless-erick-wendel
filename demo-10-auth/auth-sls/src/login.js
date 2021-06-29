const { sign } = require("jsonwebtoken");
const users = require("../db/users.json");
const JWT_KEY = process.env.JWT_KEY;

const login = async (event) => {
  console.log("Login invoked::", new Date().toISOString(), event.body);

  const { username, password } = JSON.parse(event.body);

  console.log(username, password);

  const validUser = users.find(
    (user) =>
      user.username.toUpperCase() === username.toUpperCase() &&
      user.password === password
  );

  if (!validUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }

  const signedUser = {
    scopes: validUser.scopes,
    username: validUser.username,
  };

  const token = sign(
    {
      user: signedUser,
    },
    JWT_KEY,
    { expiresIn: "5m" }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      token,
    }),
  };
};

module.exports.handler = login;
