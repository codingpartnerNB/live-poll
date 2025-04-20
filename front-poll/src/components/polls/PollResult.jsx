import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaVoteYea, FaUser, FaUserFriends, FaChartBar } from 'react-icons/fa';
import { FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollResult = ({ poll }) => {
  const [chartData, setChartData] = useState(null);
  const [winningOption, setWinningOption] = useState(null);
  const [animate, setAnimate] = useState(false);

  if (!poll || !poll.options) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);

  useEffect(() => {
    if (!poll || !poll.options || poll.options.length === 0) return;

    // Set winning option only if there are votes
    const winner = [...poll.options].reduce((max, option) => 
      (option.votes > max.votes ? option : max), { votes: -Infinity }
    );
    setWinningOption(winner.votes > 0 ? winner : null);

    // Trigger animation when winner changes
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);

    // Chart data
    const data = {
      labels: poll.options.map(option => option.text),
      datasets: [
        {
          label: 'Votes',
          data: poll.options.map(option => option.votes),
          backgroundColor: poll.options.map((option, i) => 
            option._id === winner._id ? 'rgba(234, 179, 8, 0.8)' : `rgba(139, 92, 246, ${0.4 + (i * 0.1)})`
          ),
          borderColor: poll.options.map((option, i) => 
            option._id === winner._id ? 'rgba(234, 179, 8, 1)' : `rgba(139, 92, 246, ${0.6 + (i * 0.1)})`
          ),
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };

    setChartData(data);

    return () => clearTimeout(timer);
  }, [poll]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#e5e7eb',
        bodyColor: '#d1d5db',
        borderColor: 'rgba(109, 40, 217, 0.5)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const votes = context.raw;
            const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
            return ` ${votes} votes (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          precision: 0,
          stepSize: 1
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-gray-700 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.1)_0%,transparent_70%)]"></div>
        <div className="relative flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl border border-purple-500/30 shadow-lg">
            <FaChartBar className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Poll Results</h3>
            <p className="text-sm text-purple-200">{totalVotes} total votes</p>
          </div>
        </div>
      </div>
      
      <div className="p-2 lg:p-6 flex-1 flex flex-col">
        {/* Winner badge */}
        {winningOption && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              ...(animate && {
                scale: [1, 1.05, 1],
                boxShadow: ['0 0 0 rgba(234, 179, 8, 0)', '0 0 20px rgba(234, 179, 8, 0.3)', '0 0 0 rgba(234, 179, 8, 0)']
              })
            }}
            transition={{ duration: animate ? 1 : 0.5 }}
            className="mb-6 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-4 flex items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_70%)]"></div>
            
            <div className="p-2 bg-purple-500/10 rounded-lg mr-4 z-10">
              <motion.div
                animate={animate ? { rotate: [0, 360] } : {}}
                transition={{ duration: 1 }}
              >
                <FiAward className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </div>
            <div className="z-10">
              <h4 className="text-sm font-semibold text-purple-200 mb-1">Winning Option</h4>
              <p className="text-white font-medium">{winningOption.text}</p>
              <p className="text-sm text-purple-300 mt-1">
                {winningOption.votes} votes (
                {totalVotes > 0 ? ((winningOption.votes / totalVotes) * 100).toFixed(1) : 0}%)
              </p>
            </div>
          </motion.div>
        )}

        {/* Chart container */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700 backdrop-blur-sm flex-1 min-h-[300px]">
          {chartData && poll.options.length > 0 ? (
            <Bar 
              data={chartData} 
              options={options} 
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No voting data available
            </div>
          )}
        </div>
        
        {/* Results breakdown */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1 mr-2 text-purple-300 text-sm">
              Detailed Breakdown
            </span>
          </h4>
          
          <div className="space-y-4">
            {sortedOptions.map((option, index) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              const isWinning = winningOption && option._id === winningOption._id;
              
              return (
                <motion.div 
                  key={option._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-lg p-4 border ${isWinning ? 'border-yellow-400/30 bg-gradient-to-r from-purple-900/20 to-indigo-900/20' : 'border-gray-700 bg-gray-800/50'} transition-all duration-300`}
                >
                  {isWinning && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <FiAward className="mr-1" /> Winner
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-100 truncate">{option.text}</span>
                    <span className={`font-medium ${isWinning ? 'text-yellow-400' : 'text-purple-300'} whitespace-nowrap ml-2`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                    <div 
                      className={`h-2.5 rounded-full ${isWinning ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{option.votes} vote{option.votes !== 1 ? 's' : ''}</span>
                    <span>{Math.round(percentage)}% of total</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Poll metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 border-t border-gray-700 pt-6">
          <div className="flex items-center bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-purple-500/30 transition-colors duration-300 group">
            <div className="p-2 bg-purple-500/10 rounded-lg mr-3 group-hover:bg-purple-500/20 transition-colors">
              <FaVoteYea className="text-purple-400" />
            </div>
            <span>Total votes: <span className="text-white font-medium">{totalVotes}</span></span>
          </div>
          
          <div className="flex items-center bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-purple-500/30 transition-colors duration-300 group">
            <div className="p-2 bg-purple-500/10 rounded-lg mr-3 group-hover:bg-purple-500/20 transition-colors">
              <FaUser className="text-purple-400" />
            </div>
            <span>Created by: <span className="text-white font-medium">{poll.creator?.username || 'Anonymous'}</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PollResult;