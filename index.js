const express = require("express");
const bodyParser = require("body-parser");

const initDb = require("./utils/database").initDb;

const settlementsRoutes = require("./routes/settlements");
const responsesRoutes = require("./routes/responses");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // list of domains allowed, '*' allows everything, it's a wildcard
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  ); // allows to set headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/settlements", settlementsRoutes);
app.use("/api/responses", responsesRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
    app.listen(process.env.PORT || 8080);
  }
});
