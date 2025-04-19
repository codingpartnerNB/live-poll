const express = require('express');
const router = express.Router();
const Poll = require('../models/polls');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('creator', 'username');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get active polls
router.get('/active', async (req, res) => {
  try {
    const polls = await Poll.find({
      isActive: true,
      $or: [{ endDate: { $gt: new Date() } }, { endDate: null }],
    })
      .sort({ createdAt: -1 })
      .populate('creator', 'username');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get a specific poll
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      'creator',
      'username'
    );

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Create a new poll (protected route)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, options, endDate } = req.body;

    if (!title || !options || options.length < 2) {
      return res
        .status(400)
        .json({ message: 'Please provide a title and at least two options' });
    }

    const formattedOptions = options.map((option) => ({
      text: option,
      votes: 0,
    }));

    const poll = new Poll({
      title,
      description,
      creator: req.user._id,
      options: formattedOptions,
      endDate: endDate || null,
    });

    const savedPoll = await poll.save();

    // Update user's createdPolls
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdPolls: savedPoll._id },
    });

    res.status(201).json(savedPoll);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Vote on a poll (protected route)
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { optionId } = req.body;
    const pollId = req.params.id;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: 'This poll is no longer active' });
    }

    // Check if user already voted
    if (poll.voters.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have already voted on this poll' });
    }

    // Find option and increment its votes
    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    option.votes += 1;
    poll.voters.push(userId);
    await poll.save();

    // Update user's votedPolls
    await User.findByIdAndUpdate(userId, {
      $push: { votedPolls: pollId },
    });

    res.json(poll);
  } catch (error) {
    console.error('Error in vote route:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// End a poll (creator only)
router.put('/:id/end', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user is the creator of the poll
    if (poll.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to end this poll' });
    }

    poll.isActive = false;
    poll.endDate = new Date();
    await poll.save();

    res.json({ message: 'Poll ended successfully', poll });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get polls created by a user
router.get('/user/created', protect, async (req, res) => {
  try {
    const polls = await Poll.find({ creator: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get polls voted by a user
router.get('/user/voted', protect, async (req, res) => {
  try {
    const polls = await Poll.find({ voters: req.user._id })
      .sort({ createdAt: -1 })
      .populate('creator', 'username');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;