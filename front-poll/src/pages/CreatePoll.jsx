import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';
import PollForm from '../components/polls/PollForm';
import { MdOutlineHowToVote } from 'react-icons/md';
import { motion } from 'framer-motion';

const CreatePoll = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPoll } = useSocket();
  const { showToast } = useToast();
  const PORT = import.meta.env.BACKEND_URL || 'https://poll-spark-backend.onrender.com';

  const handleSubmit = async (pollData) => {
    if (!user) {
      showToast('You must be logged in to create a poll', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.post(`${PORT}/api/polls`, 
        pollData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      createPoll(res.data);
      showToast('Poll created successfully!', 'success');
      navigate(`/polls/${res.data._id}`);
    } catch (err) {
      console.error('Error creating poll:', err);
      showToast(
        err.response?.data?.message || 'Failed to create poll',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Animated floating bubbles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-5 mb-6 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdOutlineHowToVote className="h-10 w-10 text-purple-300" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create Your Poll
          </motion.h1>
          
          <motion.p 
            className="text-xl text-purple-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Craft engaging questions and get real-time voting results from your audience.
          </motion.p>
        </motion.div>

        {/* Form container */}
        <motion.div 
          className="relative bg-gray-800 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden mx-auto max-w-3xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-transparent to-indigo-600/30 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
          
          {/* Inner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.1)_0%,transparent_70%)]" />
          
          {/* Form content */}
          <div className="relative p-4">
            <PollForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </motion.div>

        {/* Decorative floating elements */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl -z-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-600/10 rounded-full filter blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
    </div>
  );
};

export default CreatePoll;
