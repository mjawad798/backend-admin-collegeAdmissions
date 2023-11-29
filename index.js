const connectToMongo = require("./db"); // include the db connection file.
const express = require("express");
var cors = require('cors')
const app = express(); // initializing express app.
const port = 1100;
connectToMongo();
app.use(cors())
app.use(express.json());
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use("/static", express.static(__dirname + '/uploads'));
app.use("/api/a/userRoutes", require("./adminroutes/userRoutes"));
app.use("/api/a/applicantRoutes", require("./adminroutes/applicantRoutes"));
app.use("/api/a/advertismentRoutes", require("./adminroutes/advertismentRoutes"));
app.use("/api/a/applicationRoutes", require("./adminroutes/applicationRoutes"));
app.use("/api/a/lookupRoutes", require("./adminroutes/lookupRoutes"));
app.use("/api/a/quotaRoutes", require("./adminroutes/quotaRoutes"));
app.use("/api/a/adminRoutes", require("./adminroutes/adminRoutes"));
app.use("/api/a/qualificationRoutes", require("./adminroutes/qualificationRoutes"));
app.use("/api/a/reports", require("./adminroutes/reports"));



// mongodump --db=project --archive=./project.gzip --gzip

// mongorestore --gzip --archive=./project.gzip --nsFrom='project.*' --nsTo='mydb.*'









app.get("/", (req, res) => {
    res.send("Welcome to Express JS !");
  });
  
  app.listen(port, () => {
    console.log(`App is Running on Express Server on Port: ${port}`);
  });
  