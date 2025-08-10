'use strict';

var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema(
  {
    photo: { type: String, required: true, trim: true }, // URL
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);


