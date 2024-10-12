import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts } from "../../toolkit/userSlice";
import LoadingState from "../LoadingState";
import UserBlog from "./UserBlog";

const UserBlogs = () => {
  const { userPosts, isLoading } = useSelector((state) => state.userPostData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userPosts?.length === 0) {
      dispatch(fetchUserPosts());
    }
  }, [dispatch, userPosts?.length]);

  const RenderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (userPosts?.length === 0) {
      return (
        <div className="text-white text-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">No posts available</h2>
          <p>
            It looks like there aren't any posts at the moment. Check back later
            for updates!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {userPosts.map((post) => (
          <UserBlog key={post._id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-7xl mx-auto p-4">
        <RenderContent />
      </main>
    </div>
  );
};

export default UserBlogs;
