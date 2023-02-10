const express = require("express");
const cors = require("cors");
const db = require("./models/index");

//Routes declaration
const UserRoutes = require("./routes/user");

//Create node server
const app = express();
const port = 3900;

//Configure cors
app.use(cors());

//Decode data from body to object js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/user/", UserRoutes);

//Put the server to listen http requests
app.listen(port, () => {
  console.log("Node server is running in port: ", port);
});

db.sequelize
  .sync({ force: false })
  .then(() => console.log("Connected to the DB successfully"))
  .catch((e) => console.log("Error => " + e));
