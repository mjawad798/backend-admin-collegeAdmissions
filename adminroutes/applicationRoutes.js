const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Sequence = require("../models/Sequence");
var fetchuser = require("../middleware/fetchuser");
const { error } = require("toastr");
const router = express.Router();
router.post("/addSequence", 
  async (req, res) => {
   
    const {seq} = req.body;
    try {
   
      sequence = await Sequence.create({
          seq: seq
              });
      
      res.json({
        success: "true",
        message:
          "Sequence Added Successfully..",
      });
    } catch (error) {
      res.status(500).send({ success: "false", error: error });
    }
  }
);
router.post("/addApplication", fetchuser, 
    async (req, res) => {
     
      const { advertismentId, hafiz_quran, collegeId, programId, quotaId, quotaName, programName, collegeName} = req.body;
      const userId = req.user.id;
      try {
        // fetch the Auto Increment ID for Application Document...
        let seq_id ='';
        const name= 'applicationCounter';
        const applicationCounter = await Sequence.findOneAndUpdate({name: name},{"$inc":{"seq":1}},{new: true, upsert: true});
        seq_id = applicationCounter.seq;

        application = await Application.create({
            advertismentId: advertismentId,
            userId: userId,
            collegeId: collegeId,
            programId: programId,
            quotaId: quotaId,
            quotaName: quotaName,
            programName: programName,
            collegeName: collegeName,
            formNumber: seq_id,
            hafiz_quran: hafiz_quran
                });
        
        res.json({
          success: "true",
          message:
            "Application Added Successfully..",
        });
      } catch (error) {
        res.status(500).send({ success: "false", error: error });
      }
    }
  );
  router.post("/updateField", fetchuser, async (req, res) => {
    try {
  
      var userId = req.user.id;
      const applicationId = req.body.filter;
      const fieldName = req.body.fieldName;
      const fieldValue = req.body.fieldValue;
  
        const update = {
          [fieldName]: fieldValue         
        };
    
        const user = await Application.findByIdAndUpdate(applicationId,update,{new: true});
        res.send({success: true, message: user});
  
      } catch (error) {
        res.status(500).send({ success: false, error: error });
      }  });


      router.post("/updateapplication", fetchuser, async (req, res) => {
        try {
      
          const filter = {
            _id: req.body._id
          }; 
         // const update = req.body;
          const update = {hafiz_quran: req.body.hafiz_quran, reason_hq: req.body.reason_hq}; 

      
        
            const result = await Application.findByIdAndUpdate(filter,update,{new: true});
            res.send({success: true, message: result});
      
          } catch (error) {
            res.status(500).send({ success: false, error: "Unable to Update HQ" });
          }  });



router.post('/getSpecificApplications', async (req, res) => {
  try {
    const collegeName = req.body.collegeName;
    const application_data = await Application.aggregate([
      {
        $lookup: {
          from: 'applicants',
          localField: 'userId',
          foreignField: 'userId',
          as: 'applicantData'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $addFields: {
          depositSlipEmpty: { $eq: ['$depositSlip', ''] },
          userEmail: { $arrayElemAt: ['$userData.email', 0] } // Fetching the email from the user data
        }
      },
      {
        $project: {
          userData: 0 // Exclude the userData field from the result
        }
      },
      {
        $match: {
          collegeName: collegeName // Matching college Results
        }
      },
      {
        $sort: {
          depositSlipEmpty: 1,
          verification: 1
        }
      }
    ]);
  
    if (!application_data) {
      res.send({ success: false, error: "Unable to Load Data" });
    } else {
      res.send({ success: true, application_data });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});
router.post('/getApplications', async (req, res) => {
  try {
    const application_data = await Application.aggregate([
      {
        $lookup: {
          from: 'applicants',
          localField: 'userId',
          foreignField: 'userId',
          as: 'applicantData'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $addFields: {
          depositSlipEmpty: { $eq: ['$depositSlip', ''] },
          userEmail: { $arrayElemAt: ['$userData.email', 0] } // Fetching the email from the user data
        }
      },
      {
        $project: {
          userData: 0 // Exclude the userData field from the result
        }
      },
      {
        $sort: {
          depositSlipEmpty: 1,
          verification: 1
        }
      }
    ]);
  
    if (!application_data) {
      res.send({ success: false, error: "Unable to Load Data" });
    } else {
      res.send({ success: true, application_data });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});





router.post("/getIncrementID", async (req, res) => {
  const {name} = req.body;

  try {
    let seq_id ='';
   const applicationCounter = await Sequence.findOneAndUpdate({name: name},{"$inc":{"seq":1}},{new: true, upsert: true});
        //.select("seq");


    if(!applicationCounter) {
      res.send({success: false, message: "No Record Exists"});
    }
    else {
      seq_id = applicationCounter.seq;
      res.send({success: true, seq_id});

    }
  } catch (error) {
    res.send("error is ",error);
  }
});
// upload deposit slip
router.post('/uploadAdmissionSlip', fetchuser, async (req, res) => {

  try {
    var userId = req.user.id;
    const  admissionStatus=req.body.admissionStatus;
    const  applicationID=req.body.applicationID;
 
    const filter = {
      _id: applicationID
    }; 

  //    if (req.files ===null) {
  //      return res.status(400).json({error: 'Please Select file to upload..'});
  //   }
  //       accessing the file
  //   const file = req.files.file;
  //   const newPath = applicationID+'-'+'AdmissionDepositSlip';
  //   if(file.mimetype==='application/jpeg')
  //   {newFileName =newPath+'.jpg';}
  //   else
  // {  newFileName =newPath+'.png';
  // }  
  
  
  
    //  mv() method places the file inside public directory
    // file.mv(`${__dirname}/../uploads/${newFileName}`, async (err) => {
    //     if (err) {
    //         console.log(error)
    //         return res.status(500).send(error);
    //     }
    //     // As No error, we need to insert it into DB.
  //      console.log("file uploaded...");
  // update = {picture: newFileName, admissionStatus: admissionStatus}; 
 
 //   });
 update = {admissionStatus: admissionStatus}; 
 const application = await Application.findOneAndUpdate(filter,update,{new: true});
       res.send({success: true});
  
  } catch (error) {
    console.log(error);
        return res.status(500).send(error);
  }
  
  
  });



module.exports = router;
