const mongoose = require('mongoose');
const expertSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      // required: true,
    },
    experience: {
      type: String,
      // required: true,
    },
    feePerCunsultation: {
      type: Number,
      // required: true,
    },
    timings: {
      type: Array,
      // required: true,
    },
    // status: {
    //   type: String,
    //   default: "pending",
    // }
  },
  {
    timestamps: true,
  }
);

const expertModel = mongoose.model('expert', expertSchema);
module.exports = expertModel;
