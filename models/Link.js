"use strict";

var mongoose = require("mongoose");

var linkSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true }, // URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
