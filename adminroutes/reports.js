const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Advertisment = require("../models/Advertisment");

const Sequence = require("../models/Sequence");
var fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const { ObjectId } = require('mongodb');


  router.get('/programWiseSummary/:advertismentId?', async (req, res) => {
    try {
      const { advertismentId } = req.params;
    let pipeline = [];
    if(advertismentId) {
      pipeline = [
        {
            $match: {
              advertismentId: advertismentId
            }
        },
        {
          $group: {
            _id: {
              advertismentId: '$advertismentId',
              advertismentTitle: '$advertismentTitle',
              programId: '$programId'
            },
            collegeName: { $first: '$collegeName' },
            programName: { $first: '$programName' },
            Total: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              advertismentId: '$_id.advertismentId',
              advertismentTitle: '$_id.advertismentTitle'
            },
            collegeName: { $first: '$collegeName' },
            programs: {
              $push: {
                programId: '$_id.programId',
                programName: '$programName',
                Total: '$Total'
              }
            },
            Total: { $sum: '$Total' }
          }
        },
        {
          $project: {
            _id: 0,
            advertismentId: '$_id.advertismentId',
            advertismentTitle: '$_id.advertismentTitle',
            collegeName: 1,
            programs: 1,
            Total: 1
          }
        }
      ];
    }
    else{
      pipeline = [
        {
          $group: {
            _id: {
              advertismentId: '$advertismentId',
              advertismentTitle: '$advertismentTitle',
              programId: '$programId'
            },
            collegeName: { $first: '$collegeName' },
            programName: { $first: '$programName' },
            Total: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              advertismentId: '$_id.advertismentId',
              advertismentTitle: '$_id.advertismentTitle'
            },
            collegeName: { $first: '$collegeName' },
            programs: {
              $push: {
                programId: '$_id.programId',
                programName: '$programName',
                Total: '$Total'
              }
            },
            Total: { $sum: '$Total' }
          }
        },
        {
          $project: {
            _id: 0,
            advertismentId: '$_id.advertismentId',
            advertismentTitle: '$_id.advertismentTitle',
            collegeName: 1,
            programs: 1,
            Total: 1
          }
        }
      ];
    }
      
  
      const summary = await Application.aggregate(pipeline);
  
      if (summary) {
        res.json({ success: true, summary: summary });
      } else {
        res.json({ success: false, error: "Some error occurred..." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.get('/quotaWiseSummary/:advertismentId?', async (req, res) => {
    try {
      const { advertismentId } = req.params;
      let pipeline = [];
  
      if (advertismentId) {
        pipeline = [
          {
            $match: {
              advertismentId: advertismentId
            }
          },
          {
            $group: {
              _id: {
                advertismentId: '$advertismentId',
                advertismentTitle: '$advertismentTitle',
                programId: '$programId',
                quotaId: '$quotaId',
                quotaName: '$quotaName'
              },
              programName: { $first: '$programName' },
              Total: { $sum: 1 },
            }
          },
          {
            $group: {
              _id: {
                programId: '$_id.programId',
                advertismentId: '$_id.advertismentId',
                advertismentTitle: '$_id.advertismentTitle',
              },
              programName: { $first: '$programName' },
              quotas: {
                $push: {
                  quotaId: '$_id.quotaId',
                  quotaName: '$_id.quotaName',
                  Total: '$Total'
                }
              },
              Total: { $sum: '$Total' }
            }
          },
          {
            $project: {
              _id: 0,
              advertismentId: '$_id.advertismentId',
              advertismentTitle: '$_id.advertismentTitle',
              programName: 1,
              programId: '$_id.programId',
              quotas: 1,
              Total: 1
            }
          },
          {
            $sort: {
              advertismentTitle: -1,
              programName: -1,
            }
          }
        ];
      } else {
        pipeline = [
          {
            $group: {
              _id: {
                advertismentId: '$advertismentId',
                advertismentTitle: '$advertismentTitle',
                programId: '$programId',
                quotaId: '$quotaId'
              },
              programName: { $first: '$programName' },
              quotaName: { $first: '$quotaName' },
              Total: { $sum: 1 },
            }
          },
          {
            $group: {
              _id: {
                advertismentId: '$_id.advertismentId',
                advertismentTitle: '$_id.advertismentTitle',
                programId: '$_id.programId',
              },
              programName: { $first: '$programName' },
              quotas: {
                $push: {
                  quotaId: '$_id.quotaId',
                  quotaName: '$quotaName',
                  Total: '$Total'
                }
              },
              Total: { $sum: '$Total' }
            }
          },
          {
            $project: {
              _id: 0,
              advertismentId: '$_id.advertismentId',
              advertismentTitle: '$_id.advertismentTitle',
              programName: 1,
              programId: '$_id.programId',
              quotas: 1,
              Total: 1
            }
          },
          {
            $sort: {
              advertismentTitle: -1,
              programName: -1,
            }
          }
        ];
      }
  
      const summary = await Application.aggregate(pipeline);
  
      if (summary) {
        res.json({ success: true, summary: summary });
      } else {
        res.json({ success: false, error: "Some error occurred..." });
      }
    } catch (error) {
      console.error(error);
    }
    });  

  // router.get('/quotaWiseSummary/:advertismentId?', async (req, res) => {
  //   try {
  //     const { advertismentId } = req.params;
  //     let pipeline = [];
  
  //     if (advertismentId) {
  //       pipeline = [
  //         {
  //           $match: {
  //             advertismentId: advertismentId
  //           }
  //         },
  //         {
  //           $group: {
  //             _id: {
  //               advertismentId: '$advertismentId',
  //               advertismentTitle: '$advertismentTitle',
  //               programId: '$programId'
  //             },
  //             collegeName: { $first: '$collegeName' },
  //             programName: { $first: '$programName' },
  //             quotas: { $addToSet: '$quotaId' },
  //             Total: { $sum: 1 }
  //           }
  //         },
  //         {
  //           $group: {
  //             _id: {
  //               advertismentId: '$_id.advertismentId',
  //               advertismentTitle: '$_id.advertismentTitle'
  //             },
  //             collegeName: { $first: '$collegeName' },
  //             programs: {
  //               $push: {
  //                 programId: '$_id.programId',
  //                 programName: '$programName',
  //                 quotas: '$quotas',
  //                 Total: '$Total'
  //               }
  //             },
  //             Total: { $sum: '$Total' }
  //           }
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             advertismentId: '$_id.advertismentId',
  //             advertismentTitle: '$_id.advertismentTitle',
  //             collegeName: 1,
  //             programs: 1,
  //             Total: 1
  //           }
  //         }
  //       ];
  //     } else {
  //       pipeline = [
  //         {
  //           $group: {
  //             _id: {
  //               advertismentId: '$advertismentId',
  //               advertismentTitle: '$advertismentTitle',
  //               programId: '$programId'
  //             },
  //             collegeName: { $first: '$collegeName' },
  //             programName: { $first: '$programName' },
  //             quotas: { $addToSet: '$quotaId' },
  //             Total: { $sum: 1 }
  //           }
  //         },
  //         {
  //           $group: {
  //             _id: {
  //               advertismentId: '$_id.advertismentId',
  //               advertismentTitle: '$_id.advertismentTitle'
  //             },
  //             collegeName: { $first: '$collegeName' },
  //             programs: {
  //               $push: {
  //                 programId: '$_id.programId',
  //                 programName: '$programName',
  //                 quotas: '$quotas',
  //                 Total: '$Total'
  //               }
  //             },
  //             Total: { $sum: '$Total' }
  //           }
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             advertismentId: '$_id.advertismentId',
  //             advertismentTitle: '$_id.advertismentTitle',
  //             collegeName: 1,
  //             programs: 1,
  //             Total: 1
  //           }
  //         }
  //       ];
  //     }
  
  //     const summary = await Application.aggregate(pipeline);
  
  //     if (summary) {
  //       res.json({ success: true, summary: summary });
  //     } else {
  //       res.json({ success: false, error: "Some error occurred..." });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // });
  
  
  
  
  
router.get('/adWiseSummary/:advertismentId?', async (req, res) => {
  try {
    const { advertismentId } = req.params;
    let pipeline = [];

    if (advertismentId) {
      pipeline = [
        {
          $match: {
            advertismentId: advertismentId
          }
        },
        {
          $group: {
            _id: '$advertismentId',
            Total: { $sum: 1 },
            advertismentTitle: { $first: '$advertismentTitle' }
          }
        }
      ];
    } else {
      pipeline = [
        {
          $group: {
            _id: '$advertismentId',
            Total: { $sum: 1 },
            advertismentTitle: { $first: '$advertismentTitle' }
          }
        }
      ];
    }

    const summary = await Application.aggregate(pipeline);
if(summary)
{
    res.json({success: true, summary: summary});

}
else
{
    res.json({success: false, error: "Some error occured..."});

}
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/collegeWiseSummary/:advertismentId?', async (req, res) => {
  try {
    const { advertismentId } = req.params;
    let pipeline = [];

    if (advertismentId) {
      pipeline = [
        {
          $match: {
            advertismentId: advertismentId
          }
        },
        {
          $group: {
            _id: '$advertismentId',
            Total: { $sum: 1 },
            advertismentTitle: { $first: '$collegeName' }
          }
        }
      ];
    } else {
      pipeline = [
        {
          $group: {
            _id: '$advertismentId',
            Total: { $sum: 1 },
            advertismentTitle: { $first: '$collegeName' }
          }
        }
      ];
    }

    const summary = await Application.aggregate(pipeline);
if(summary)
{
    res.json({success: true, summary: summary});

}
else
{
    res.json({success: false, error: "Some error occured..."});

}
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/getAdvertisments", async (req, res) => {
  try {
 
      const advertisment_data = await Advertisment.find({}, "_id title college");
      res.send({success: true, advertisment_data});
    } catch (error) { 
      console.log(error);
      res.status(500).send(error); }  });


  
  
  
  



module.exports = router;
