const express = require("express");
const router = express.Router();
const Expert = require("../experts/Model");
const User = require("../register/Model")



router.post("/get-expert-info-by-user-id",async (req, res) => {
    try {
      const expert = await Expert.findOne({ email: req.body.email });
      res.status(200).send({
        success: true,
        message: "Expert info fetched successfully",
        data:expert,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting expert info", success: false, error });
    }
  });
  router.post("/get-expert-info",async (req, res) => {
    try {
      const expert = await Expert.findOne({email:req.body.email});
      res.status(200).send({
        success: true,
        message: "Expert info fetched successfully",
        data: expert,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting expert info", success: false, error });
    }
  });
  router.patch("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
      const expert = await Expert.findOneAndUpdate(
        { email: req.body.email },
        req.body
      );
      res.status(200).send({
        success: true,
        message: "Expert profile updated successfully",
        data:expert,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting doctor info", success: false, error });
    }
  });