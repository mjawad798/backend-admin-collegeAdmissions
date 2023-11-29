const express = require("express");
const mongoose = require("mongoose");
// const User = require("../models/User");
const Applicant = require("../models/Applicant");
var fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Router 1 : This Router will Update or Insert the Applicant Record. Also, we will use the "auth-token" to Verify if the user
// is authorized or not. If user is not authorized, we will return error and will not insert the record.. else The record will
// be inserted.
router.post("/getApplicantProfiles", fetchuser, async (req, res) => {
  try {
    const profiles = await Applicant.find();
    
    if(profiles.length === 0) {
      res.send({success: false, error: "No Records Exist"});
    }
    else {
      res.send({success: true, profiles});
    }
  } catch (error) {
    res.send({success: false, error: error.error});
  }
});
// Update Applicant by ID
router.post("/updateApplicant",
[
  body("name", "Name must be atleast 5 characters long").isLength({ min: 3 }),
  body("dob", "dob can't be Empty").isLength({min:8,}),
  body("cnic", "cnic must be more than 10 characters").isLength({ min: 10,}),
  body("religion", "religion must be more than 5 characters").isLength({ min: 5,}),
  body("gender", "gender must be more than 3 characters").isLength({ min: 3,}),
  body("marital_status", "marital_status must be more than 6 characters").isLength({ min: 6,}),
  body("contact1", "contact1 must be more than 10 characters").isLength({ min: 11,}),
  body("contact2", "contact2 must be more than 10 characters").isLength({ min: 11,}),
  body("province", "province must be more than 5 characters").isLength({ min: 5,}),
  body("domicile", "domicile must be more than 3 characters").isLength({ min: 3,}),
  body("income", "income must be more than 3 characters").isLength({ min: 3,}),
  body("maddress", "maddress must be more than 3 characters").isLength({ min: 3,}),
  body("paddress", "paddress must be more than 3 characters").isLength({ min: 3,}),
  body("hafiz_quran", "hafiz_quran must be 1 character").isLength({ max: 3,}),
  body("hostel_facility", "hostel_facility must be 1 character").isLength({ max: 3,}),
  body("transport_facility", "transport_facility must be 1 character").isLength({ max: 3,}),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    const formattedErrorMessages = errorMessages.join("<br/>");
    return res.status(400).json({ success: false, error: formattedErrorMessages });
  }
    try {
        const filter = {userId : req.body.userId};
        const update = {
			name: req.body.name,
            fname: req.body.fname,
            cnic: req.body.cnic,
            gender: req.body.gender,
            religion: req.body.religion,
            landline: req.body.landline,
            contact1: req.body.contact1,
            contact2: req.body.contact2,
            province: req.body.province,
            domicile: req.body.domicile,
            marital_status: req.body.marital_status,
            hafiz_quran: req.body.hafiz_quran,
            transport_facility: req.body.transport_facility,
            hostel_facility: req.body.hostel_facility,
            income: req.body.income,
            dob: req.body.dob,
            maddress: req.body.maddress,
            paddress: req.body.paddress 
        };
		
        const applicant = await Applicant.findOneAndUpdate(filter,update,{new: true});
		if(applicant)
        {
			
			res.send({success: true, applicant});
	}
	else
		res.status(500).json({success: false, error: "Unable to Update the Applicant"});
   

      } catch (error) { 
	  res.status(500).json({success: false, error:error}); 
  
	  }  });

    // Router 3: Update / Insert the Qualification of the User

// router.post("/updateSpecificQualification", async (req, res) => {
//   try {
//       const filter = {userId : req.body.userId};
//       const update = {
//         _id: req.body.qualification_id,
//         title: req.body.title,
//         studyGroup: req.body.studyGroup,
//         session: req.body.session,
//         board: req.body.board,
//         passingYear: req.body.passingYear,
//         rollno: req.body.rollno,
//         obtainedMarks: req.body.obtainedMarks,
//         totalMarks: req.body.totalMarks, 
//           };
//           update["_id"] = new mongoose.Types.ObjectId();

//       const user = await Applicant.updateOne(filter,{ $push: {"qualification": update}},
//       {returnNewDocument: true}
//         );
//         if(user)
//       res.send({success: true, user});
//       else
//       console.log("Unable to add qualification");
//       return;
//     } catch (error) { res.status(500).send(error); }  });
router.post("/updateSpecificQualification", async (req, res) => {
  try {
    const filter = { userId: req.body.userId, "qualification._id": req.body._id };
    const update = {
      $set: {
        "qualification.$.title": req.body.title,
        "qualification.$.studyGroup": req.body.studyGroup,
        "qualification.$.session": req.body.session,
        "qualification.$.board": req.body.board,
        "qualification.$.passingYear": req.body.passingYear,
        "qualification.$.rollno": req.body.rollno,
        "qualification.$.obtainedMarks": req.body.obtainedMarks,
        "qualification.$.totalMarks": req.body.totalMarks,
      },
    };

    const user = await Applicant.updateOne(filter, update);

    if (user.modifiedCount > 0) { // Use modifiedCount instead of nModified
      res.send({ success: true, user });
    } else {
      console.log("No modifications made or unable to update");
      res.send({ success: false, message: "No modifications made or unable to update" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
});

    
    
  //Route 3... Delete Qualification
 router.delete("/deleteQualification/:id", fetchuser, async (req, res) => {
            try {
                const filter = {userId : req.user.id};
                const user = await Applicant.updateOne(filter,{ $pull: {"qualification": {_id: req.params.id}}},
                {returnNewDocument: true}
                  );
                res.send({success: true, user});
              } catch (error) { res.status(500).send(error); }  });
    

// a4ddToSet   == to ensure a unique sub document insertion....
// Router 3: Fetch the Applicant Saved Profile from DB if any....
router.post("/getApplicantProfile", fetchuser, async (req, res) => {
  try {
    var userId = req.user.id;
    //const applicant = await Applicant.findOne({userId: userId}).select("-qualification").toObject();
    const profile_data = await Applicant.findOne({userId: userId});
    
    if(!profile_data) {
      res.send({success: false, error: "No Record Exists"});
    }
    else {
      // console.log("from backend console",applicant);
      res.send({success: true, profile_data});

    }
  } catch (error) {
    res.send("error is ",error);
  }
});
// Router 4: Fetch the Applicant Qualification if any...
router.post("/getApplicantQualification", fetchuser, async (req, res) => {
  try {
    var userId = req.user.id;
    const qualification_data = await Applicant.findOne({userId: userId}).select('qualification');
    
    if(!qualification_data) {
      res.send({success: false, error: "No Record Exists"});
    }
    else {
      // console.log("from backend console",applicant);
      res.send({success: true, qualification_data});

    }
  } catch (error) {
    res.send("error is ",error);
  }
});



// Route 5: upload file check...

// router.post('/upload', (req, res) => {

// try {
//   var userId = req.body.userId;
//   const filter = {userId : userId};
//   const  documentType=req.body.documentType;
//    if (req.files ===null) {
//      return res.status(400).json({msg: 'Please Select file to upload..'});
//   }
//       // accessing the file
//       let date_ob = new Date();

//   const file = req.files.file;
//   const newPath = userId+date_ob+'Pic-'+documentType;

//   if(documentType==='picture')
//   {
//     if(file.mimetype ==='image/jpeg')
//     newFileName =newPath+'.jpg';
//     else
//     newFileName =newPath+'.png';
//   }
//   else
// {  newFileName =newPath+'.pdf';
// }  



//   //  mv() method places the file inside public directory
//   file.mv(`${__dirname}/../uploads/${newFileName}`, async (err) => {
//       if (err) {
//           console.log(err)
//           return res.status(500).send(err);
//       }
//       // As No error, we need to insert it into DB.
      
//       //const update ={};
//       if(documentType==='picture')
//        update = {picture: newFileName};   
//       else
//       update = {dmc: newFileName};

//       const applicant = await Applicant.findOneAndUpdate(filter,update,{new: true});
//       res.send({success: true, fileName: newFileName});
//   });

// } catch (error) {
//   return res.status(500).send(error);
// }


// });


router.post('/upload', (req, res) => {
  try {
    const userId = req.body.userId;
    const filter = { userId: userId };
    const documentType = req.body.documentType;
    
    if (req.files === null) {
      return res.status(400).json({ msg: 'Please Select file to upload..' });
    }
    
    // Create formatted date string
    const date_ob = new Date();
    const year = date_ob.getFullYear();
    const month = String(date_ob.getMonth() + 1).padStart(2, '0');
    const day = String(date_ob.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
console.log(formattedDate);
    const file = req.files.file;
    const newPath = userId + formattedDate + 'Pic-' + documentType;

    let newFileName;
    if (documentType === 'picture') {
      if (file.mimetype === 'image/jpeg') newFileName = newPath + '.jpg';
      else newFileName = newPath + '.png';
    } else {
      newFileName = newPath + '.pdf';
    }

    file.mv(`${__dirname}/../uploads/${newFileName}`, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      let update = {};
      if (documentType === 'picture') {
        update = { picture: newFileName };
      } else {
        update = { dmc: newFileName };
      }

      const applicant = await Applicant.findOneAndUpdate(filter, update, { new: true });
      res.send({ success: true, fileName: newFileName });
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});


    // Router 7: Get Applicant Documents uploaded so far...

router.post("/getApplicantDocuments", fetchuser, async (req, res) => {
  try {
    var userId = req.user.id;
    const documents_data = await Applicant.findOne({userId: userId}).select('picture dmc -_id');
    
    if(!documents_data) {
      res.send({success: false, error: "No Record Exists"});
    }
    else {
      // console.log("from backend console",applicant);
      res.send({success: true, documents_data});

    }
  } catch (error) {
    res.send("error is ",error);
  }
});







  module.exports = router;


