'use strict';

var mongoose = require('mongoose');

var aboutPhotoSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, min: 0 },
    url: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutPhoto', aboutPhotoSchema);


