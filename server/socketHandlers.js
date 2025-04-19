const Poll = require('./models/polls');

const setupSocketHandlers = (io) => {
  // Connected users storage
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle user joining poll room
    socket.on('join_poll', async (pollId) => {
      socket.join(pollId);
      console.log(`User ${socket.id} joined poll: ${pollId}`);

      try {
        // Fetch updated poll data
        const poll = await Poll.findById(pollId);
        if (poll) {
          // Send poll data to the newly joined user
          io.to(pollId).emit('poll_data', poll);
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    });

    // Handle vote
    socket.on('submit_vote', async ({ pollId, optionId, userId }) => {
      try {
        // Update poll in database
        const poll = await Poll.findById(pollId);

        if (!poll) {
          socket.emit('error', { message: 'Poll not found' });
          return;
        }

        // Check if user already voted
        const userVoted = poll.voters.includes(userId);

        if (userVoted) {
          socket.emit('error', { message: 'You have already voted on this poll' });
          return;
        }

        // Find option and increment its votes
        const option = poll.options.id(optionId);
        if (option) {
          option.votes += 1;
          poll.voters.push(userId);
          await poll.save();

          // Broadcast updated poll data to all users in the room
          io.to(pollId).emit('poll_data', poll);
        } else {
          socket.emit('error', { message: 'Option not found' });
        }
      } catch (error) {
        console.error('Error submitting vote:', error);
        socket.emit('error', { message: 'Failed to submit vote' });
      }
    });

    // Handle user authentication
    socket.on('authenticate', (userId) => {
      if (userId) {
        connectedUsers.set(socket.id, userId);
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
      }
    });

    // Handle creating a new poll
    socket.on('create_poll', async (pollData) => {
      try {
        // Poll is created through the API, but we notify subscribers
        io.emit('new_poll_created', { pollId: pollData._id });
      } catch (error) {
        console.error('Error broadcasting new poll:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (connectedUsers.has(socket.id)) {
        const userId = connectedUsers.get(socket.id);
        console.log(`User ${userId} disconnected`);
        connectedUsers.delete(socket.id);
      } else {
        console.log(`Socket ${socket.id} disconnected`);
      }
    });
  });
};

module.exports = { setupSocketHandlers };