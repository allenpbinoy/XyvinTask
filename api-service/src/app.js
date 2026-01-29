const express = require("express");
const app = express();

app.use(express.json());
app.use("/rides", require("./routes/ride.routes"));

app.use("/drivers", require("./routes/driver.routes"));
module.exports = app;
