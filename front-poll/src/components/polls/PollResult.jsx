import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { FaVoteYea, FaUser } from 'react-icons/fa'
import { formatDate } from '../../utils/dataUtils'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const PollResults = ({ poll }) => {
  const [chartData, setChartData] = useState(null)

  if (!poll || !poll.options) {
    return <div>Loading poll results...</div>
  }
  
  // Calculate total votes
  // const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const totalVotes = (poll?.options || []).reduce((sum, option) => sum + option.votes, 0)
  
  // Sort options by votes (descending)
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)

  // Prepare chart data
  useEffect(() => {
    if (!poll) return
    
    const data = {
      labels: poll.options.map(option => option.text),
      datasets: [
        {
          label: 'Votes',
          data: poll.options.map(option => option.votes),
          backgroundColor: [
            'rgba(63, 131, 248, 0.8)',
            'rgba(20, 184, 166, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderColor: [
            'rgba(63, 131, 248, 1)',
            'rgba(20, 184, 166, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(236, 72, 153, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
    
    setChartData(data)
  }, [poll])

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const votes = context.raw
            const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0
            return `${votes} votes (${percentage}%)`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }

  return (
    <div className="card animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Poll Results</h3>
      
      <div className="mb-6 mt-4">
        {chartData && <Bar data={chartData} options={options} />}
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Breakdown</h4>
        <div className="space-y-3">
          {sortedOptions.map((option) => (
            <div key={option._id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-800">{option.text}</span>
                <span className="font-medium text-primary-600">
                  {totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {option.votes} vote{option.votes !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
        <div className="flex items-center mb-2 md:mb-0">
          <FaVoteYea className="text-gray-400 mr-1" />
          <span>Total votes: {totalVotes}</span>
        </div>
        <div className="flex items-center mb-2 md:mb-0">
          <FaUser className="text-gray-400 mr-1" />
          <span>Created by: {poll.creator?.username || 'Anonymous'}</span>
        </div>
        {poll.endDate && (
          <div>
            {new Date(poll.endDate) < new Date() ? 'Ended on' : 'Ends on'}: {formatDate(poll.endDate)}
          </div>
        )}
      </div>
    </div>
  )
}

export default PollResults