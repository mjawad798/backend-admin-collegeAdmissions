const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require('nodemailer');


// below code for sending email only....

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
     auth: {
          user: 'noreply-helpdesk@uop.edu.pk',
          pass: 'rktqpobjeaysvcjx',
       },
  secure: true,
  });


  // end.. below code for sending email only......



//json web tocken to be concatenated with signature.
//Route 1:  Applicant Signup -- POST Method...
router.post(
  "/createuser",
  [
    body("email", "Email address is not valid. please check it").isEmail(),
    body("name", "Name must be atleast 3 characters long").isLength({ min: 3 }),
    body("password", "Password must be 3 characters minimum").isLength({
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
      let user = await User.findOne({ email });
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

      user = await User.create({
        name: name,
        password: secPassword,
        email: email,
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
router.get('/users', fetchuser, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// Router 8:// Update a user's information
router.post('/updateusers', async (req, res) => {
  try {
    const id = req.body._id;
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    var secPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(id, { name, email, password: secPassword   }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post("/updateField", fetchuser, async (req, res) => {
  try {

    var userId = req.user.id;
    const fieldName = req.body.fieldName;
    const fieldValue = req.body.fieldValue;

      const update = {
        [fieldName]: fieldValue         
      };
  
      const user = await User.findByIdAndUpdate(userId,update,{new: true});
      res.send({success: true, message: user});

    } catch (error) {
      res.status(500).send({ success: false, error: error });
    }  });
//Route 2:  login authentication of a user using post... Email, Password Required....
router.post(
  "/login",
  [
    body("email", "Email address is not valid. please check it").isEmail(),
    body("password", "Password Can'nt be null").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, error: "This Email does Not exists.. " });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Incorect Password. Please login via Correct Credentials...",
          });
      }

      const data = {
        user: { id: user.id },
      };
      const {lockProfile, step1, step2, step3, step4} = user;

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, authToken, email, lockProfile, step1, step2, step3, step4 });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send("Unable to find the user OR generate the Auth Token");
    }
  }
);
// Route 3: Fetching loggedIn User Details using the AuthToken received from frontend....
// we first have to decode the authtokenr received from client and extract the userID from that..
// Secondly, we need to compare it with DB User ID... if matched, we have to return
// the user details of DB... we need to use a middleware function which will decode the authtoken of client.
// Note: we are already sending the UserID of db in authtoken to client after authentication.
//for this a separe function is created in middleware/ folder..
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    var userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if(user)
    res.send({ Success: true, user: user });
    else
    res.send({ Success: false});

  } catch (error) {
    res.send(error);
  }
});

// Route 3: Fetching loggedIn User Details using the AuthToken received from frontend....
// we first have to decode the authtokenr received from client and extract the userID from that..
// Secondly, we need to compare it with DB User ID... if matched, we have to return
// the user details of DB... we need to use a middleware function which will decode the authtoken of client.
// Note: we are already sending the UserID of db in authtoken to client after authentication.
//for this a separe function is created in middleware/ folder..
router.post("/authenticateApplicant", fetchuser, async (req, res) => {
  try {
    var userId = req.user.id;
    const user = await User.findById(userId).select("-password -_id -name");
    if(user)
    res.send({ success: true, user: user });
    else
    res.send({ success: false});
  
  } catch (error) {
   res.send(error);
  }
});

// Route 4: for sending email to a user.... checking only.

router.post("/sendEmail", async(req, res) =>{
    const {to, subject, html} = req.body;
const mailData = {
  from: 'noreply-helpdesk@uop.edu.pk',
  to: to,
  subject: subject,
  html: html
};

transporter.sendMail(mailData, function(error, info) {
  if (error) {
      res.send({success: false, error});
  } else {
    res.send({ success: true});  }
});
 
});

// Router 5: Verifiy if email address exists in Users collection for Password Reset Attempt...

router.put("/getEmailAddress", async (req, res) => {
  try {
    var email = req.body.email;
    let user = await User.findOne({ email });
    if (user) { res.send({ success: true}); }
    else {
      res.send({ success: false});
      
    }
  } catch (error) {
    res.send(error);
  }
});

// Router 6: Update User Password...

router.post("/updatePassword", async (req, res) => {
  try {

    // Encrypting the Password ..
    const {email, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    var secPassword = await bcrypt.hash(password, salt);

      const filter = {email: email};
      const update = {
          password: secPassword         
      };
  
      const user = await User.findOneAndUpdate(filter,update,{new: true});
      res.send({success: true, message: user});

    } catch (error) {
      res.status(500).send({ success: false, error: error });
    }  });

module.exports = router;
