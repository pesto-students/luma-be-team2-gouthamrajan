const User = require('./Model');
const Expert = require('../experts/Model');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  const { displayName, email, isExpert } = req.body;
  if (!displayName || !email)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //create and store the new user if isExpert is false
    let result = null;
    if (!isExpert) {
      result = await User.create({
        displayName: displayName,
        email: email,
        createdAt: new Date().toUTCString(),
        createdBy: 'LUMA_ADMIN',
      });
    } else {
      result = await Expert.create({
        displayName: displayName,
        email: email,
        createdAt: new Date().toUTCString(),
        createdBy: 'LUMA_ADMIN',
      });
    }

    console.log(result);

    res.status(201).json({ success: `New user ${displayName} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/getUserName', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    //get username
    const result = await User.findOne({
      email,
    });

    console.log(result);

    res.status(201).json({ displayName: result.displayName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/get-user-info', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: 'User does not exist', success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting user info', success: false, error });
  }
});

router.get('/get-all-approved-experts', async (req, res) => {
  try {
    const doctors = await Expert.find({ status: 'approved' });
    res.status(200).send({
      message: 'Expert fetched successfully',
      success: true,
      data: doctors,
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

module.exports = {
  router,
};
