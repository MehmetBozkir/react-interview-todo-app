const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Not authorized to access this resource" });
  }
  try {
    const data = jwt.verify(token, "SECRET_KEY");
    req.userId = data.id;
    next();
  } catch {
    return res
      .status(401)
      .send({ error: "Not authorized to access this resource" });
  }
};

module.exports = authenticate;
