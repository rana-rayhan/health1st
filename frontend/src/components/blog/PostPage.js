import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, MessageCircle, Calendar, Send, Loader } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostComment,
  fetchPosts,
  updatePostComments,
} from "../../toolkit/postSlice";
import LoadingState from "../LoadingState";

const PostPage = () => {
  const { state: postState } = useLocation();
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { posts, isLoading } = useSelector((state) => state.postData);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("loggedUser"));
  }, []);

  useEffect(() => {
    if (!posts?.length) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts?.length]);

  useEffect(() => {
    if (postState?._id && posts?.length) {
      const foundPost = posts.find((post) => post._id === postState._id);
      setCurrentPost(foundPost || null);
    }
  }, [postState, posts]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (isLoggedIn && !isSubmittingComment && newComment.trim()) {
      setIsSubmittingComment(true);
      try {
        const res = await axios.post("/api/comment/create", {
          content: newComment,
          postId: currentPost._id,
        });

        if (res?.data?.payload) {
          const updatedComments = [...currentPost.comments, res.data.payload];
          setCurrentPost((prevPost) => ({
            ...prevPost,
            comments: updatedComments,
          }));

          // Dispatch action to update Redux state with the new comment
          dispatch(
            updatePostComments({
              postId: currentPost._id,
              newComment: res.data.payload,
            })
          );
        }

        setNewComment(""); // Clear the input after submission
      } catch (error) {
        console.error("Error submitting comment:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (isLoggedIn) {
      try {
        await axios.delete(`/api/comment/delete/${commentId}`);

        // Update the current post's comments state
        setCurrentPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.filter(
            (comment) => comment._id !== commentId
          ),
        }));

        // Dispatch action to update Redux state with the removed comment
        dispatch(
          deletePostComment({
            postId: currentPost._id,
            commentId,
          })
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
        // Show an error message to the user if necessary
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      {isLoading ? (
        <LoadingState />
      ) : (
        currentPost && (
          <div className="max-w-3xl mx-auto bg-transparent rounded-lg shadow-xl overflow-hidden border border-blue-950">
            <header className="bg-gradient-to-r from-gray-800 to-gray-950 p-6 text-white">
              <h1 className="text-3xl font-bold">{currentPost.title}</h1>
              <div className="flex items-center mt-4 text-sm">
                <User size={16} className="mr-2" />
                <span className="mr-4">{currentPost.author.name}</span>
                <Calendar size={16} className="mr-2" />
                <span>
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </span>
              </div>
            </header>

            <main className="p-6">
              <p className="text-gray-100 leading-relaxed">
                {currentPost.content}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="inline-block bg-gray-800 text-gray-400 px-4 py-1 rounded-full text-xs font-semibold">
                  {currentPost.diseases.name}
                </span>
                <div className="flex items-center text-gray-500">
                  <MessageCircle size={16} className="mr-1" />
                  <span className="text-sm">
                    {currentPost.comments.length} Comments
                  </span>
                </div>
              </div>
            </main>

            <section className="p-4 bg-gradient-to-r from-gray-950 to-gray-800">
              <h2 className="text-xl mt-4 font-semibold mb-2 flex text-gray-300 items-center">
                <MessageCircle size={20} className="mr-2" />
                Comments
              </h2>
              {currentPost.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-800 p-4 rounded-lg shadow mb-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-100">
                      {comment.author.name}
                    </p>
                    {JSON.parse(localStorage.getItem("loggedUser"))?._id ===
                      comment.author._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{comment.content}</p>
                </div>
              ))}

              <form onSubmit={handleCommentSubmit} className="mt-6">
                <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      isLoggedIn
                        ? "Add a comment..."
                        : "Please log in to comment"
                    }
                    className="flex-grow p-3 bg-transparent text-gray-100 focus:outline-none"
                    disabled={!isLoggedIn || isSubmittingComment}
                  />
                  <button
                    type="submit"
                    className={`text-white p-3 transition duration-300 ${
                      isLoggedIn && !isSubmittingComment && newComment.trim()
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    disabled={
                      !isLoggedIn || isSubmittingComment || !newComment.trim()
                    }
                  >
                    {isSubmittingComment ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
                {isSubmittingComment && (
                  <p className="text-blue-400 mt-2 text-sm">
                    Submitting comment...
                  </p>
                )}
              </form>
            </section>
          </div>
        )
      )}
    </div>
  );
};

export default PostPage;
