const express = require('express');
const router = express.Router();
const Quota = require('../models/lookUpQuota');

// Insert a new quota
router.post('/quota', async (req, res) => {
  const quota = new Quota({
    name: req.body.name
  });

  try {
    const newQuota = await quota.save();
    res.status(201).json(newQuota);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all quotas
router.get('/getQuota', async (req, res) => {
    try {
      const quotas = await Quota.find();
      res.json(quotas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Delete a quota
router.post('/deleteQuota', async (req, res) => {
    try {
      const quota = await Quota.findByIdAndDelete(req.body._id);
  
      if (!quota) {
        res.status(404).json({ message: 'Quota not found' });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
