const route = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../db/model").User;
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret123";

function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, TOKEN_SECRET);
}

route.get("/", (req, res) => {
  jwt.verify(req.query.token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status = 500;
      return res.send({ errors: err });
    }
    res.json(decoded);
  });
});

route.post("/", async (req, res) => {
  const query = req.body;
  console.log("query = ", query);
  try {
    const result = await User.findOne({
      where: {
        username: query.username,
        password: query.password,
      },
    });
    if (result) {
      const name = result.name;
      const token = generateAccessToken({ ...query, name });
      res.send({
        data: {
          token,
          name,
        },
      });
    } else {
      res.send({ errors: "Invalid username or password" });
    }
  } catch (err) {
    res.send({ errors: err });
  }
});

exports = module.exports = route;
