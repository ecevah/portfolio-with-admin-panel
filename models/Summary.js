'use strict';

var mongoose = require('mongoose');

var summarySchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    who: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Summary', summarySchema);


