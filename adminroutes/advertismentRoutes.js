const express = require("express");
const mongoose = require("mongoose");
// const User = require("../models/User");
const Advertisment = require("../models/Advertisment");
var fetchuser = require("../middleware/fetchuser");
const router = express.Router();

//Route 1: Add Advertisment.... it is for admin side insertion...


// for admin .. addadvertisment
router.post("/addAdvertisment", async (req, res) => {
  // console.log(req.body)
  // return;
  const { title, startDate, endDate, description, college, programsOffered } = req.body;
  try {
   
    const update = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      description: description,
      college: college,
      programsOffered: programsOffered
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const result = await Advertisment.create(update);
    
    res.json({
      success: "true",
      message: "Advertisement Added Successfully, Please login to Continue..",
      data: result
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).send({ success: "false", error: " unable" });
  }
});
router.post("/updateAdvertisment", async (req, res) => {
  const {advId, title, startDate, endDate, description, college, programsOffered } = req.body;
  try {
   
    const update = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      description: description,
      college: college,
      programsOffered: programsOffered
    };
    const options = {new: true, setDefaultsOnInsert: true };
   // const result = await Advertisment.create(update);
    const result = await Advertisment.findByIdAndUpdate(advId,update,{new: true});

    
    res.json({
      success: "true",
      message: "Advertisement Updated Successfully....",
      data: result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: "false", error: error });
  }
});
// Router 2: Add Programs offered into Advertisment Collection.. 

    
// Router 3: Get list of Advertisment where admissions are still open based start date and end date in document

//db.advertisments.find({startDate: {$lte: new ISODate("2023-02-28")}, endDate: {$gte: new ISODate("2023-02-28")}})

router.get("/getAdvertisments", async (req, res) => {
  try {
    let date_ob = new Date();
 
    const filter = {startDate: {$lte: new Date()}, endDate: {$gte: new Date()}};
      const advertisment_data = await Advertisment.find(filter);
      res.send({success: true, advertisment_data});
    } catch (error) { 
      console.log(error);
      res.status(500).send(error); }  });

      router.get("/allAdvertisments", async (req, res) => {
        try {
       
            const advertisment_data = await Advertisment.find();
            res.send({success: true, advertisment_data});
          } catch (error) { 
            console.log(error);
            res.status(500).send(error); }  });
    
   // db.advertisments.find({startDate: {$lte: new ISODate("2023-02-28")}, endDate: {$gte: new ISODate("2023-02-28")}})




  module.exports = router;


