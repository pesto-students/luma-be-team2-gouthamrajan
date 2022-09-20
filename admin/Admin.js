const express = require('express');
const router = express.Router();
const User = require('../user/Model');
const Expert = require('../expert/Model');

// tested
router.get('/get-all-experts', async (req, res) => {
  try {
    const experts = await Expert.find({});
    res.status(200).send({
      message: 'Experts fetched successfully',
      success: true,
      data: experts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching experts',
      success: false,
      error,
    });
  }
});

//tested
router.get('/get-all-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: 'Users fetched successfully',
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching users',
      success: false,
      error,
    });
  }
});

// issue
router.post('/change-expert-account-status', async (req, res) => {
  try {
    const { email, status } = req.body;
    // const expert = await Expert.findByIdAndUpdate(email, {
    //   status,
    // });
    const expert = await Expert.findOneAndUpdate(email, {
      status,
    });

    const user = await User.findOne({ email });
    console.log(user);
    const unseenNotifications = user?.unseenNotifications;
    unseenNotifications?.push({
      type: 'new-expert-request-changed',
      message: `Your expert account has been ${status}`,
      onClickPath: '/notifications',
    });
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
      message: 'Error applying expert account',
      success: false,
      error,
    });
  }
});

module.exports = { router };
