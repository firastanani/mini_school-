const Joi = require("joi");
const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    subject_en: {
      type: String,
    },
    subject_ar: {
      type: String,
    },
    description_en: {
      type: String,
    },
    description_ar: {
      type: String,
    },
    costPerHour: {
      type: Number,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

  },
  { timestamps: true, toObject: { virtuals: true } }
);


const Service = mongoose.model("Service", serviceSchema);

exports.Service = Service;
