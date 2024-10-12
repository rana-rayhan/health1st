const jwt = require("jsonwebtoken");

const createJsonWebToken = (payload, secretkey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be non empty object");
  }
  if (typeof secretkey !== "string" || secretkey === "") {
    throw new Error("Secret Key must be non empty string");
  }
  try {
    const token = jwt.sign(payload, secretkey, { expiresIn: expiresIn });
    return token;
  } catch (error) {
    console.error("Faild to sign the jWT:", error);
    throw error;
  }
};

module.exports = {
  createJsonWebToken,
};
