"use strict";

var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    nameSurname: { type: String, required: true, trim: true },
    // Stored as hash; controllers will hash on create/update
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
