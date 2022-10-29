const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    expertEmail: {
      type: String,
      required: true,
    },
    expertInfo: {
      type: Object,
      //required: true,
    },
    userInfo: {
      type: Object,
      //required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("appointmenst", appointmentSchema);
module.exports = appointmentModel;
