'use strict';

var mongoose = require('mongoose');

var aboutDetailSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, min: 0 },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutDetail', aboutDetailSchema);


