require("dotenv").config();
const connectDB = require("./config/db");

(async () => {
  await connectDB();
  require("./workers/ride.worker");
  console.log("Worker running...");
})();
