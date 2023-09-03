// require("dotenv").config({ path: "./.env.local", override: true });
require("dotenv").config();

const express = require("express");

const app = express();

const cors = require("cors");

const { logger } = require("./src/app.helper.js");
const { sequelize } = require("./src/app.dbconfig.js");
const { after } = require("./src/app.middleware.js");

/**
 *@description Enables Cross-Origin-Resource-Sharing, anyone from anywhere can access this API unless you set the origin object property value as specified like : cors({origin: ["127.0.0.1", "192.168.254.001"]})
 */
app.use(cors());
app.use(express.json({ strict: true })); // Parses all Request and Response data into json format, ignores the non-json content-type and its request body

app.use("/api", require("./src/app.routes.js")); // Routes

app.use(after.routeNotFound);
app.use(after.errorMiddleware);

const port = process.env.api_port;

sequelize
  .authenticate()
  .then(async () => {
    // await sequelize.sync({ alter: true }); // Uncomment if any changes are made from the defined models/tables to sync changes from the ORM to the SQL server DB
  })
  .catch((err) => {
    logger("Database Connection Failed", err);
  })
  .finally(() => {
    app.listen(port, logger(`Now Serving :${port}`));
  });
