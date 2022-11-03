const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Expert = require('../models/expertModel');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/experts', authMiddleware, async (req, res) => {
  try {
    const experts = await Expert.find({});
    res.status(200).send({
      message: 'Expert fetched successfully',
      success: true,
      data: experts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying expert account',
      success: false,
      error,
    });
  }
});
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: 'users fetched successfully',
      greetings: 'hello',
      success: true,
      data: users,
    });
    console.log(users, 'users');
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying users account',
      success: false,
      error,
    });
  }
});
router.post(
  '/change-expert-account-status',
  authMiddleware,
  async (req, res) => {
    try {
      const { ExpertId, status } = req.body;

      const expert = await Expert.findByIdAndUpdate(ExpertId, {
        status,
      });
      console.log(expert, 'expert_data');
      const user = await User.findOne({ _id: expert.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: 'new-expert-request-changed',
        message: `Your expert account has been ${status}`,
        onClickPath: '/notifications',
      });
      await User.findByIdAndUpdate(user._id, { unseenNotifications });
      user.isExpert = status === 'approved' ? true : false;
      await user.save();
      res.status(200).send({
        message: 'Expert status updated successfully',
        success: true,
        data: expert,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error applying users account',
        success: false,
        error,
      });
    }
  }
);

module.exports = { router };
