import React from "react";
import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-6xl font-extrabold text-indigo-400">
            404
          </h2>
          <p className="mt-2 text-center text-3xl font-bold text-gray-200">
            Page Not Found
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <span className="h-14 w-14 rounded-full bg-indigo-700 flex items-center justify-center">
              <Search className="h-8 w-8 text-indigo-300" />
            </span>
            <span className="h-14 w-14 rounded-full bg-indigo-800 flex items-center justify-center">
              <Search className="h-6 w-6 text-indigo-400" />
            </span>
            <span className="h-14 w-14 rounded-full bg-indigo-900 flex items-center justify-center">
              <Search className="h-4 w-4 text-indigo-500" />
            </span>
          </div>
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          If you think this is an error, please{" "}
          <a
            href="/contact"
            className="font-medium text-indigo-400 hover:text-indigo-500"
          >
            contact our support team
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
