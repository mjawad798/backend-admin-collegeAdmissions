const express = require('express');
const mongoose = require('mongoose');
// var fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Qualification = require('../models/lookUpQualification');



// Get all documents
router.post('/getSpecificQualification', async (req, res) => {
  try {
    const name =  req.body.name;
    const qualification = await Qualification.find({name: name});
    res.status(200).json(qualification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});  

// Get all documents
router.get('/', async (req, res) => {
  try {
    console.log("request received");
    const qualification = await Qualification.find();
    res.status(200).json(qualification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new document
router.post('/create', async (req, res) => {
    try {
      const { name, label, studyGroup } = req.body;
      const qualification = new Qualification({
        name,
        label,
        studyGroup,
      });
      await qualification.save();
      res.status(201).json(qualification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  


// Get a document by ID
router.get('/:id', async (req, res) => {
  try {
    const qualification = await Qualification.findById(req.params.id);
    if (!qualification) throw new Error('Document not found');
    res.status(200).json(qualification);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a document by ID
router.post('/updatedData/:id', async (req, res) => {
  try {
    const { name, label, studyGroup } = req.body;
    const qualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      { name, label, studyGroup },
      { new: true }
    );
    if (!qualification) {
      throw new Error('Document not found');
    }
    res.status(200).json({ success: true, qualification });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});



// Delete a document by ID
router.post('/:id', async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(req.params.id);
    if (!qualification) throw new Error('Document not found');
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



module.exports = router;
