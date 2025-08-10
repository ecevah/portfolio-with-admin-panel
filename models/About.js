'use strict';

var mongoose = require('mongoose');

var aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    header: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);


