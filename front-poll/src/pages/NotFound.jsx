import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle, HiHome } from 'react-icons/hi'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <div className="relative inline-block mb-8">
          <HiOutlineExclamationCircle className="h-32 w-32 text-purple-400 mx-auto" />
          <div className="absolute -inset-4 rounded-full bg-purple-500/10 animate-pulse"></div>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            404 - Page Not Found
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.<br />
          Don't worry, let's get you back to safety.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 group"
        >
          <HiHome className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
          Return to Homepage
        </Link>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-purple-300 font-medium mb-3">Maybe you wanted to...</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/features" className="hover:text-white transition-colors">View our features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Check pricing</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Read our blog</Link></li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-blue-300 font-medium mb-3">Need help?</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact support</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Visit FAQ</Link></li>
              <li><Link to="/status" className="hover:text-white transition-colors">Check system status</Link></li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-indigo-300 font-medium mb-3">Popular pages</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Your dashboard</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Account settings</Link></li>
              <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound