require("dotenv").config(); // readme -- 11 -- dotenv
//
//server port
const serverPort = process.env.SERVER_PORT || 6000;
//
// mongodb url
const mongodbUrl =
  process.env.MONGO_ATLAS_URL || "mongodb://localhost:27017/ecommerceP7";
//
// default image for user
const userDefaultImage =
  process.env.DEFAULT_USER_IMAGE || "public/images/default/user.png";
const productDefaultImage =
  process.env.DEFAULT_PRODUCT_IMAGE || "public/images/default/product.png";
//
//jwt token secret key
const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY ||
  "E7H6VnK42C9s3jBm8FgR5YpXqLwTzD1iU0aO4eN7xJ2yM6vP3oZ5uG8cH5bX9tF6";
//
// smtp username, password & CLIENT URL
const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL;

// cloudinary
const cloudinaryName = process.env.CLOUDINARY_NAME || "";
const cloudinaryKey = process.env.CLOUDINARY_KEY || "";
const cloudinaryApi = process.env.CLOUDINARY_API || "";
//
//
// export variables
module.exports = {
  serverPort,
  mongodbUrl,
  userDefaultImage,
  productDefaultImage,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientUrl,
  cloudinaryName,
  cloudinaryKey,
  cloudinaryApi,
};
