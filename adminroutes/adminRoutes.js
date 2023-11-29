
const express = require("express");
const router = express.Router();
const Admin = require("../models/AdminLogin");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
const fs = require('fs');


// Backup DB code..
// mongodump --db=project --archive=./project.gzip --gzip
// mongorestore --gzip --archive=./new.gzip --nsFrom='project.*' --nsTo='mydb.*'

// router.get('/backup', (req, res) => {
  
//   const DB_NAME = "project";
//   const ARCHIVE_PATH = path.join(__dirname, '/../../public/backups/', `${DB_NAME}.gzip`);

//   const command = `mongodump --db=${DB_NAME} --archive=${ARCHIVE_PATH} --gzip`;
//   exec(command, (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }
//     res.download(ARCHIVE_PATH, `${DB_NAME}.gzip`, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//       }
//       // Clean up backup file after download
//       fs.unlink(ARCHIVE_PATH, (err) => {
//         if (err) {
//           console.error(err);
//         }
//       });
//     });
//   });
// });
router.get('/backup', (req, res) => {
  const DB_NAME = "project";
  const now = new Date();
  const dateString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
  const ARCHIVE_PATH = path.join(__dirname, '/../../public/backups/', `${DB_NAME}_${dateString}.gzip`);

  const command = `mongodump --db=${DB_NAME} --archive=${ARCHIVE_PATH} --gzip`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.download(ARCHIVE_PATH, `${DB_NAME}_${dateString}.gzip`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      // Clean up backup file after download
      fs.unlink(ARCHIVE_PATH, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  });

  // Handle any errors that occur during the download process
  res.on('error', (err) => {
    console.error(err);
    return res.status(500).send(err);
  });

  // Handle the case where the download is cancelled by the user
  res.on('close', () => {
    console.log('Download cancelled by user');
    fs.unlink(ARCHIVE_PATH, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  // Set the timeout for the response
  res.setTimeout(30000);
});


//Create new Admin
router.post(
    "/createadmin",fetchuser,
    [
      body("email", "Email address is not valid. please check it").isEmail(),
      body("name", "Name must be atleast 3 characters long").isLength({ min: 3 }),
      body("password", "Password must be 3 characters minimum").isLength({
        min: 5,
      }),
      body("role", "role must be 3 characters minimum").isLength({
        min: 3,
      }),
      body("college", "college must be 3 characters minimum").isLength({
        min: 5,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      const { name, email, password } = req.body;
      // now we will look into db if the user with same email exists or not...
      try {
        // Check if the User with this email exists or not...
        let user = await Admin.findOne({ email });
        if (user) {
          return res
            .status(400)
            .json({
              success: "false",
              error: "Sorry a user with this email exists already..",
            });
        }
        // Encrypting the Password ..
        const salt = await bcrypt.genSalt(10);
        var secPassword = await bcrypt.hash(password, salt);
        user = await Admin.create({
            name: name,
            password: secPassword,
            email: email,
            role: req.body.role,
            college: req.body.college,
          });
          
        
        res.json({
          success: "true",
          message:
            "Your Account Created Successfully, Please login to Continue..",
        });
      } catch (error) {
        res.status(500).send({ success: "false", error: error });
      }
      
    }

  
    
  );

  //Login Admin

  router.post(
    "/loginAdmin",
    [
      body("email", "Email is invalid or missing.").isEmail().exists(),
      body("password", "Password is required.").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {email, password } = req.body;
  
      try {
        let user = await Admin.findOne({ email });
        if (!user) {
          return res.status(400).json({ success: false, error: "Invalid login credentials Email. Please try again." });
        }
  
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res.status(400).json({ success: false, error: "Invalid login credentials Password. Please try again." });
        }
  
        // if (name !== user.name || role !== user.role || college !== user.college) {
        //   return res.status(400).json({ success: false, error: "Invalid login credentials users. Please try again." });
        // }
  
        const data = {
          user: { id: user.id },
        };
  
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success: true, authToken, user });
      } catch (error) {
        console.log(error);
        res.status(500).send("Unable to find the user or generate the Auth Token.");
      }
    }
  );


  

// GET all admins
router.get('/admin', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

  
  //Update the admin 
 // Update an admin by ID


 router.post('/updateAdmin', async (req, res) => {
  try {
    const adminId = req.body._id;
    const { name, email, password, role, college } = req.body;
    let updatedAdmin = {};

    if (name) updatedAdmin.name = name;
    if (email) updatedAdmin.email = email;
    if (password) 
	{
		// Encrypting the Password ..
        const salt = await bcrypt.genSalt(10);
        var secPassword = await bcrypt.hash(password, salt);
		updatedAdmin.password = secPassword;}
    if (role) updatedAdmin.role = role;
    if (college) updatedAdmin.college = college;

    updatedAdmin = await Admin.findByIdAndUpdate(adminId, updatedAdmin, { new: true });
    

    res.json(updatedAdmin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

  //Delete the admin
  router.post("/admin/:id", async (req, res) => {
    try {
      await res.admin.remove();
      res.json({ message: "Admin deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  module.exports = router;