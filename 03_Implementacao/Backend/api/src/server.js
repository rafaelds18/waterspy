const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parser requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(process.cwd() + "/WaterSpy/dist/WaterSpy/"));

const db = require("./app/models");
const { Role } = require("./app/models");

db.sequelize.sync().then(() => {
  initializeRoles();
});

function initializeRoles() {
  Role.findOrCreate({
    where: { description: 'Admin' },
    defaults: {
      id: 1,
      description: 'Admin'
    }
  });

  Role.findOrCreate({
    where: { description: 'Consumer' },
    defaults: {
      id: 2,
      description: 'Consumer'
    }
  })
}


require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/consumption.routes")(app);
require("./app/routes/supplier.routes")(app);
require("./app/routes/contract.routes")(app);
require("./app/routes/meter.routes")(app);
require("./app/routes/notifications.routes")(app);
require("./app/routes/role.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});