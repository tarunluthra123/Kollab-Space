const route = require("express").Router();

route.use("/login", require("./login"));
route.use("/signup", require("./signup"));

exports = module.exports = {
  route,
};
