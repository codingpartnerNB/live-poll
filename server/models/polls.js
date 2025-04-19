const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    options: [optionSchema],
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for checking if poll has ended
pollSchema.virtual('hasEnded').get(function () {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
});

// Pre-save middleware to check and update isActive status
pollSchema.pre('save', function (next) {
  if (this.endDate && new Date() > this.endDate) {
    this.isActive = false;
  }
  next();
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;