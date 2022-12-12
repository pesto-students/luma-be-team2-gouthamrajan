const express = require('express');
const router = express.Router();
const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Expert = require("../models/expertModel")
const authMiddleware = require("../middleware/authMiddleware")
const Appointment = require("../models/appointments")
const moment = require('moment')
router.post('/register', async (req, res) => {
  try {
    //res.send("Hello world")
    console.log(req.body)
    console.log(req.body.password)
    const email = req.body.email
    const userExists = await User.findOne({ email });
    console.log("hello")
    if (userExists) {
      return res.status(200).json({ message: 'user is already registered.', success: false })
    }

    const password = req.body.password;
    //console.log(password,"password")
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt)
    //console.log(hashedPassword,"passwordhash")
    req.body.password = hashedPassword
    const newuser = new User(req.body)
    //console.log(newuser)
    await newuser.save();
    res.status(200).send({ message: "user created successfully", success: true })

  } catch (error) {
    res.status(500).send({ message: "password don't match", success: false })
  }

})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }

})

router.post('/userDetails', authMiddleware, async (req, res) => {
  try {

    const user = await User.findOne({ _id: req.body.userId })
    user.password = undefined
    if (!user) {
      return res.status(200).send({ message: "user does not exist", success: false })
    }
    else {
      res.status(200).send({
        success: true,
        data: user
      })
    }
  } catch (error) {
    res.status(500)
      .send({
        message: "Error getting user info",
        success: false, error
      })

  }
})
router.post('/admin', async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.body.password)
    const email = req.body.email
    const userExists = await User.findOne({ email });
    console.log("hello")
    if (userExists) {
      return res.status(200).json({ message: 'user is already registered.', success: false })
    }
    const password = req.body.password;
    //console.log(password,"password")
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword, "passwordhash")
    req.body.password = hashedPassword
    const newuser = new User(req.body)
    await newuser.save();
    //console.log(newuser)
    res.status(200).send({ message: "user created successfully", success: true })
  } catch (error) {
    res.status(500).send({ message: "something is wrong", success: false })
  }
})
router.post('/apply-expert', authMiddleware, async (req, res) => {
  try {
    //res.send("Hello world")
    const newExpert = new Expert({ ...req.body, status: "pending" })
    await newExpert.save();
    const adminUser = await User.findOne({ isAdmin: true })
    const unseenNotifications = adminUser.unseenNotifications
    unseenNotifications.push({
      type: "new-Expert-request",
      message: `${newExpert.firstName} ${newExpert.lastName} has applied for expert account`,
      data: {
        expertId: newExpert._id,
        name: newExpert.firstName + " " + newExpert.lastName
      },
      onClickPath: "/admin/experts"
    })

    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications })
    res.status(200).send({
      success: true,
      message: "expert account applied successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "error applying expert account", success: false })
  }

})
router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    user.seenNotifications = seenNotifications;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: "error applying expert account", success: false })
  }

})

router.post('/delete-all-notification', authMiddleware, async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email });
    //findOneAndUpdate
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });



  }


})
/*router.get('/applyExpertDetails',async(req,res)=>{
     
        let result = await Expert.find({})
        console.log(result)
        res.send({"msg":result})
})
*/
router.get("/get-all-approved-experts", authMiddleware, async (req, res) => {
  try {
    const experts = await Expert.find({ status: "approved" });
    res.status(200).send({
      message: "expert fetched successfully",
      success: true,
      data: experts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body)
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.expertInfo.userId });

    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  }
  catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error in applying expert account",
      success: false,
      error,
    })
  }
})
router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1,'hours').toISOString();
    const toTime = moment(req.body.time,"HH:mm").add(1,'hours').toISOString();
    const expertId = req.body.expertId
    const appointments = await Appointment.find({
      expertId,
      date,
      time:{$gte:fromTime,$lte:toTime},
    })
   if(appointments.length > 0){
      return res.status(200).send({
          message:"Appointment not available",
          success:false
      })
   }else{
         return res.status(200).send({
           message:"Appointment available",
           success:true
         })
   }
  }
  catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error in applying expert account",
      success: false,
      error,
    })
  }
})
router.get("/get-appointments-by-user-id",authMiddleware,async(req,res)=>{
  try{
     const appointments = await Appointment.find({userId:req.body.userId})
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

module.exports = { router }