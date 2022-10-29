const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Expert = require('../models/expertModel');
const authMiddleware = require('../middleware/authMiddleware');
const Appointment = require("../models/appointments")
router.post("/get-expert-info-by-user-id", authMiddleware, async (req, res) => {
    try {
      console.log(req.body)
      const expert = await Expert.findOne({userId:req.body.userId});
      console.log(expert)
      res.status(200).send({
        success: true,
        message: "expert info fetched successfully",
        data:expert,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting doctor info", success: false, error });
    }
  });
  router.post("/update-expert-profile", authMiddleware, async (req, res) => {
    try {
      const expert = await Expert.findOneAndUpdate(
        { userId: req.body.userId },
        req.body
      );
      res.status(200).send({
        success: true,
        message: "expert profile updated successfully",
        data: expert,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting expert info", success: false, error });
    }
  });
  router.post("/get-expert-info-by-id", authMiddleware, async (req, res) => {
    try {
      const expert = await Expert.findOne({_id:req.body.expertId});
      res.status(200).send({
        success: true,
        message: "expert info fetched successfully",
        data:expert,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting expert info", success: false, error });
    }
  });
  router.get("/get-appointments-by-expert-id",authMiddleware,async(req,res)=>{
    try{
       const expert = await Expert.find({userId:req.body.userId})
       const appointments = await Appointment.find({_Id:expert._Id})
       res.status(200).send({
         message:"Appointment fetched successfully",
         success:true,
         data:appointments,
       })
    }catch(error){
      console.log(error)
      res.status(500).send({
          message:"Error fetching the appointments",
          success:false,
          error,
      })
    }
  })
  router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
      const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
        status,
      });
  
      const user = await User.findOne({ _id: appointment.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "appointment-status-changed",
        message: `Your appointment status has been ${status}`,
        onClickPath: "/appointments",
      });
  
      await user.save();
  
      res.status(200).send({
        message: "Appointment status updated successfully",
        success: true
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error changing appointment status",
        success: false,
        error,
      });
    }
  });
  module.exports = { router }