const express = require('express');
const router = express.Router();
const Expert = require('./Model');
const Appointments = require("../Appointments/appointmentModel")
router.post('/get-expert-info', async (req, res) => {
  try {
    const expert = await Expert.findOne({ email: req.body.email });
    console.log(req.body.email);
    res.status(200).send({
      success: true,
      message: 'Expert info fetched successfully',
      data: expert,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting expert info', success: false, error });
  }
});

router.post('/get-expert-info-userEmail', async (req, res) => {
  try {
    const expert = await Expert.findOne({ email: req.body.email });
    if(!expert) throw new Error()
    res.status(200).send({
      success: true,
      message: 'Expert info fetched successfully',
      data: expert,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting expert info', success: false, error });
  }
});
router.patch('/update-expert-profile', async (req, res) => {
  try {
    const expert = await Expert.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      {new:true}
    );
    res.status(200).send({
      success: true,
      message: 'Expert profile updated successfully',
      data: expert,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting expert info', success: false, error });
  }
});

router.post(
  "/get-appointments-by-expert",
  async (req, res) => {
    try {
      const expert = await Expert.findOne({ email:req.body.email });
      const appointments = await Appointments.find({ expertEmail:expert.email});
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);

module.exports = {
  router,
};