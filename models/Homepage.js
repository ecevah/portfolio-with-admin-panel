"use strict";

var mongoose = require("mongoose");

var homepageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true }, // URL
    aboutText: { type: String, required: true },
    aboutImage: { type: String, required: true, trim: true }, // URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homepage", homepageSchema);
