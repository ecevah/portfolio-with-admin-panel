'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectDetailSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    order: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      required: true,
      enum: ['Text', 'Double Text', 'Image', 'Double Image'],
    },
    photo: { type: String, trim: true },
    content: { type: String, trim: true },
    secondPhoto: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectDetail', projectDetailSchema);


