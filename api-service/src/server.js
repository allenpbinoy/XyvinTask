require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

(async () => {
  await connectDB();
  app.listen(process.env.PORT, () =>
    console.log("API running on port", process.env.PORT)
  );
})();
