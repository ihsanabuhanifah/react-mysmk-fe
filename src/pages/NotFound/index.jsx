
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <IoIosAlert className="text-gray-500 text-9xl mb-8" /> */}
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600 transition-all">
        Go Back Home
      </Link>
    </div>
  );
}
