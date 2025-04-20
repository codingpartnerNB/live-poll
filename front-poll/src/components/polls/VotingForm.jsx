import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaVoteYea } from 'react-icons/fa';

const VotingForm = ({ options = [], onVote, loading, userHasVoted }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      onVote(selectedOption);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1 mr-2 text-purple-300 text-sm">
          Cast Your Vote
        </span>
      </h3>
      
      {userHasVoted ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center flex-1 text-center p-8"
        >
          <div className="p-4 bg-green-500/10 rounded-full mb-4 border border-green-500/20">
            <FaVoteYea className="h-8 w-8 text-green-400" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">Vote Submitted!</h4>
          <p className="text-gray-400">Thank you for participating in this poll.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
          <div className="space-y-3">
            {options.map((option, index) => (
              <motion.div
                key={option._id || index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="poll-option"
                    value={option._id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={loading}
                    className="hidden"
                  />
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${selectedOption === option._id ? 
                    'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/50 shadow-lg' : 
                    'bg-gray-800/50 border-gray-700 hover:border-purple-500/30'}`}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-300 ${selectedOption === option._id ? 
                        'border-purple-500 bg-purple-500' : 'border-gray-500'}`}
                      >
                        {selectedOption === option._id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-2 w-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                      <span className={`font-medium ${selectedOption === option._id ? 'text-white' : 'text-gray-300'}`}>
                        {option.text}
                      </span>
                    </div>
                  </div>
                </label>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={!selectedOption || loading}
            whileHover={!selectedOption || loading ? {} : { scale: 1.02 }}
            whileTap={!selectedOption || loading ? {} : { scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${!selectedOption || loading ?
              'bg-gray-700/50 text-gray-500 cursor-not-allowed' :
              'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/20'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Submitting...
              </span>
            ) : (
              'Submit Vote'
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default VotingForm;