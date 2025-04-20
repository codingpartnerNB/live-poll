import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaVoteYea } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { HiTrash } from 'react-icons/hi';
import { formatDistanceToNow } from '../../utils/dataUtils';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Modal from 'react-modal'; // Ensure this library is installed

const PollCard = ({ poll, handleDelete }) => {
  const { user } = useAuth();
  const { showToast } = useToast(); // Use the toast hook
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const createdTimeAgo = formatDistanceToNow(new Date(poll.createdAt));
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (!user) {
      navigate('login');
      return;
    }
    navigate(`/polls/${poll._id}`);
  };

  const confirmDelete = async () => {
    try {
      await handleDelete(poll._id); // Call the delete handler
      showToast('Poll deleted successfully!', 'success'); // Show success toast
    } catch (error) {
      console.error('Error deleting poll:', error);
      showToast('Failed to delete poll. Please try again.', 'error'); // Show error toast
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative group h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30">
      {/* Background shine effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Border gradient */}
      <div className="absolute inset-0 rounded-xl p-px bg-gradient-to-br from-purple-500/30 via-blue-400/30 to-purple-500/30 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-xl bg-gray-900/95 group-hover:bg-gray-900/90 transition-all duration-300"></div>
      </div>

      {/* Main content */}
      <div className="relative h-full flex flex-col p-5 rounded-xl">
        {/* Status badge */}
        {!poll.isActive && (
          <div className="absolute top-4 right-4 bg-gradient-to-br from-red-900 to-rose-800 text-rose-100 text-xs px-3 py-1 rounded-full border border-rose-700/50 shadow-sm z-10">
            Closed
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-purple-200 group-hover:text-purple-300 transition-colors duration-300">
            <Link to={`/polls/${poll._id}`} className="hover:underline decoration-purple-400/50">
              {poll.title}
            </Link>
          </h3>
          {user && user._id === poll.creator && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200"
              title="Delete Poll"
            >
              <HiTrash className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Description */}
        {poll.description && (
          <p className="text-gray-400 mb-5 line-clamp-2 relative z-10">{poll.description}</p>
        )}

        {/* Poll options */}
        <div className="space-y-3 mb-5 flex-grow relative z-10">
          {poll.options.slice(0, 2).map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <div key={option._id} className="relative group/option">
                <div className="absolute inset-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700/70 group-hover/option:border-purple-500/50 transition-all duration-300"></div>
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="relative px-4 py-2.5 flex justify-between">
                  <span className="text-gray-100 font-medium truncate pr-2">{option.text}</span>
                  <span className="text-purple-300 font-medium whitespace-nowrap">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            );
          })}

          {poll.options.length > 2 && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              +{poll.options.length - 2} more options
            </p>
          )}
        </div>

        {/* Footer stats */}
        <div className="relative z-10 mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <FaUser className="text-gray-500 mr-1.5" size={12} />
                <span>{poll.creator?.username || 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <FaVoteYea className="text-gray-500 mr-1.5" size={12} />
                <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">
              {createdTimeAgo}
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleViewDetails}
            className="relative inline-flex items-center justify-center w-full px-4 py-2.5 overflow-hidden font-medium transition-all duration-300 ease-out rounded-lg group bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400"
          >
            <span className="absolute bottom-0 right-0 w-8 h-2 -mb-1 -mr-1 transition-all duration-500 ease-out transform rotate-45 translate-x-1 bg-white/30 group-hover:-translate-x-2"></span>
            <span className="absolute top-0 left-0 w-8 h-2 -mt-1 -ml-1 transition-all duration-500 ease-out transform -rotate-45 -translate-x-1 bg-white/30 group-hover:translate-x-2"></span>
            <span className="relative w-full text-center text-white flex items-center justify-center">
              View Details
              <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PollCard;