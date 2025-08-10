'use strict';

var mongoose = require('mongoose');

var quoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);


