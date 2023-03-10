const express = require("express");
const cors = require("cors");
const db = require("./models/index");

//Routes declaration
const UserRoutes = require("./routes/user");
const AreaRoutes = require("./routes/area");
const SideRoutes = require("./routes/side");
const StateRoutes = require("./routes/state");
const BoxRoutes = require("./routes/box");
const FolderRoutes = require("./routes/folder");
const EmployeeRoutes = require("./routes/employee");
const MovementRoutes = require("./routes/movement");

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
app.use("/api/area/", AreaRoutes);
app.use("/api/side/", SideRoutes);
app.use("/api/state/", StateRoutes);
app.use("/api/box/", BoxRoutes);
app.use("/api/folder/", FolderRoutes);
app.use("/api/employee/", EmployeeRoutes);
app.use("/api/movement/", MovementRoutes);

//Put the server to listen http requests
app.listen(port, () => {
  console.log("Node server is running in port: ", port);
});

// //Esto se usa en dev nomas, en prod no porque puede destruir todos los registros
// db.sequelize
//   .sync({ force: false })
//   .then(() => console.log("Connected to the DB successfully"))
//   .catch((e) => console.log("Error => " + e));
