const app = require("./app");
const connectDB = require("./config/db");
const { serverPort } = require("./secret");
//
//
// app listening
app.listen(serverPort, async () => {
  console.log(`Listening on http://localhost:${serverPort}`);
  await connectDB();
});
