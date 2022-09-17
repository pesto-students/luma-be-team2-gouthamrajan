const User = require('./Model');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  const { displayName,email,isExpert} = req.body;
  if (!displayName || !email)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //create and store the new user
    const result = await User.create({
      displayName: displayName,
      email: email,
      isExpert:isExpert,
      createdAt: new Date().toUTCString(),
      createdBy: 'LUMA_ADMIN',
    });

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

module.exports = {
  router,
};
