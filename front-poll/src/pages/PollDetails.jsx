import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiChevronLeft, HiShare, HiOutlineExclamation } from 'react-icons/hi';
import { FaPoll, FaUserFriends, FaVoteYea } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import VotingForm from '../components/polls/VotingForm';
import PollResult from '../components/polls/PollResult';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';
import { formatDistanceToNow } from '../utils/dataUtils';
import Modal from 'react-modal'; // Install this library using `npm install react-modal`

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, PORT } = useAuth();
  const { socket, joinPoll, submitVote } = useSocket();
  const { showToast } = useToast();
  
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPoll = async () => {
    try {
      const res = await axios.get(`${PORT}/api/polls/${id}`);
      setPoll(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load poll data');
      console.error('Error fetching poll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  useEffect(() => {
    if (socket) {
      joinPoll(id);

      const handlePollData = (updatedPoll) => {
        setPoll(updatedPoll);
      };

      const handleError = (err) => {
        showToast(err.message, 'error');
      };

      socket.on('poll_data', handlePollData);
      socket.on('error', handleError);

      return () => {
        socket.off('poll_data', handlePollData);
        socket.off('error', handleError);
      };
    }
  }, [socket, id, joinPoll, showToast]);

  const handleVote = async (optionId) => {
    if (!user) {
      showToast('You must be logged in to vote', 'error');
      return;
    }
    
    setVotingLoading(true);
    
    try {
      await axios.post(`${PORT}/api/polls/${id}/vote`, 
        { optionId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      submitVote(id, optionId, user._id);
      showToast('Your vote has been recorded!', 'success');
    } catch (err) {
      console.error('Error submitting vote:', err);
      showToast(
        err.response?.data?.message || 'Failed to submit vote',
        'error'
      );
    } finally {
      setVotingLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll?.title || 'Live Poll',
        text: `Vote on "${poll?.title}"`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      setIsSharing(true);
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showToast('Link copied to clipboard!', 'success');
          setTimeout(() => setIsSharing(false), 2000);
        })
        .catch(() => {
          showToast('Failed to copy link', 'error');
          setIsSharing(false);
        });
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting poll with ID:', poll._id); // Debugging line
      await axios.delete(`${PORT}/api/polls/${poll._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      showToast('Poll deleted successfully', 'success');
      navigate('/dashboard'); // Redirect to dashboard or another page
    } catch (error) {
      console.error('Error deleting poll:', error);
      showToast('Failed to delete poll', 'error');
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-1"
        >
          <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center">
            <FaPoll className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-gradient-to-br from-red-900/20 to-rose-900/20 backdrop-blur-sm rounded-xl border border-red-700/30 p-8 my-12 shadow-2xl"
      >
        <div className="flex items-center text-red-300">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <HiOutlineExclamation className="h-8 w-8 mr-3" />
          </motion.div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-rose-300">
            Failed to load poll
          </h2>
        </div>
        <p className="mt-3 text-red-200/90">{error || 'Poll not found'}</p>
        <Link 
          to="/" 
          className="mt-6 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-700/40 to-rose-700/40 border border-red-700/50 rounded-xl text-red-100 hover:bg-red-700/50 transition-all duration-300 group"
        >
          <HiChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </motion.div>
    );
  }

  const userHasVoted = user && poll.voters.includes(user._id);
  const createdTimeAgo = formatDistanceToNow(new Date(poll.createdAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl animate-float-delay"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 py-8"
      >
        {/* Header with glass effect */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-2xl overflow-hidden"
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-y-6 -inset-x-20 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-20 animate-shimmer"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <motion.button 
                onClick={() => navigate(-1)} 
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer px-5 py-2.5 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <HiChevronLeft className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </motion.button>
              
              <motion.button 
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-5 py-2.5 cursor-pointer bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 hover:bg-gray-700/60 transition-all duration-300 shadow-lg"
              >
                <HiShare className="mr-2" />
                {isSharing ? 'Copied!' : 'Share Poll'}
              </motion.button>
            </div>

            <div className="mt-4 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center p-4 mb-4 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full border border-purple-500/30 shadow-lg"
              >
                <FaPoll className="h-8 w-8 text-purple-300" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 mb-3">
                {poll.title}
              </h1>
              <div className="flex items-center justify-center text-sm text-gray-400">
                <FaUserFriends className="mr-2 text-purple-300" />
                <span>{poll.voters.length} participant{poll.voters.length !== 1 ? 's' : ''}</span>
                <span className="mx-3">•</span>
                <FaVoteYea className="mr-2 text-indigo-300" />
                <span>{poll.options.reduce((sum, opt) => sum + opt.votes, 0)} votes</span>
                <span className="mx-3">•</span>
                <span>Created {createdTimeAgo}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl overflow-hidden"
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 transition-all duration-500 rounded-2xl"></div>
            </div>
            
            <VotingForm 
              options={poll.options} 
              onVote={handleVote} 
              loading={votingLoading} 
              userHasVoted={userHasVoted}
            />
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl overflow-hidden"
          >
            <PollResult poll={poll} />
          </motion.div>
        </div>

        {/* Delete poll button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Poll
          </button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="relative bg-gray-800/90 p-6 rounded-lg shadow-lg max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this poll?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Global styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default PollDetails;
