const express = require("express");
const mongoose = require("mongoose");
const Province = require("../models/Province");
const router = express.Router();

//Route 1: Add Advertisment.... it is for admin side insertion...

router.post(
  "/addProvince",
  async (req, res) => {
   
    try {
   

      advertisment = await Province.create({
       name: req.body.name
      });
      
      res.json({
        success: "true",
        message:
          "Province Added Successfully.",
      });
    } catch (error) {
      res.status(500).send({ success: "false", error: error });
    }
  }
);

router.post("/updateDomicile", async (req, res) => {
    try {
        const filter = {id : '6406c35fb6241a9110c130eb'};
        const domicile = req.body;
        domicile["_id"] = new mongoose.Types.ObjectId();
        const user = await Province.updateOne(filter,{ $push: {"domicile": domicile}},{returnNewDocument: true});
        res.send({success: true, user});
      } catch (error) { res.status(500).send(error); }  });

      router.get("/getProvinces", async (req, res) => {
        try {
          const province_data = await Province.find();
          
          if(!province_data) {
            res.send({success: false, message: "No Record Exists"});
          }
          else {
            res.send({success: true, province_data});
      
          }
        } catch (error) {
          res.send("error is ",error);
        }
      });



  module.exports = router;


