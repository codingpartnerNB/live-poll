import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <HiOutlineExclamationCircle className="h-24 w-24 text-primary-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go back to home
        </Link>
      </div>
    </div>
  )
}

export default NotFound