const route = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../db/model").User;
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret123";

function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, TOKEN_SECRET);
}

let c = 0;

route.get("/", (req, res) => {
  // console.log("c=", c);
  c++;
  jwt.verify(req.query.token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status = 500;
      return res.send({ error: err });
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
      res.json({
        error: {
          status: 500,
          msg: "Invalid username or password",
        },
      });
    }
  } catch (err) {
    res.status(500);
    res.send({ error: err });
  }
});

exports = module.exports = route;
