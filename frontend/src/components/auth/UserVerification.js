import axios from "axios";
import { Verified } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../app/apiEndpoint";

const UserVerification = () => {
  const { token } = useParams("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/api/users/verify`,
        { token },
        { withCredentials: true }
      );
      console.log(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8 text-center">
        {/* {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )} */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="relative w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Verified className="h-5 w-5 mr-2" />
          {isLoading ? "Verifying..." : "Start Verification"}
        </button>
      </div>
    </div>
  );
};

export default UserVerification;
