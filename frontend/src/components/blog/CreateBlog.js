import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { FileText, Tag, Send } from "lucide-react";
import { diseases } from "./data";
import UserBlogs from "./UserBlogs";
import axios from "axios";
import { addPost } from "../../toolkit/postSlice";
import { addUserPost } from "../../toolkit/userSlice";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [isLoadingPost, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!user) {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    diseaseName: "",
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(formData);
      const res = await axios.post(
        "https://health1st.onrender.com/api/post/create",
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(addPost(res?.data?.post));
      dispatch(addUserPost(res?.data?.post));
      // If the API call is successful:
      toast.success(`Post created successfully!`);
      // Clear the form
      setFormData({ title: "", diseaseName: "", content: "" });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-indigo-400 mb-8">
          Create a New Blog Post
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-500 text-sm">
              <FileText className="h-5 w-5" />
            </span>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="focus:ring-indigo-500 py-2 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-700 bg-gray-800 text-gray-200"
              placeholder="Enter your blog post title"
              required
            />
          </div>

          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-500 text-sm">
              <Tag className="h-5 w-5" />
            </span>
            <select
              id="disease"
              name="disease"
              value={formData.diseaseName}
              onChange={(e) =>
                setFormData({ ...formData, diseaseName: e.target.value })
              }
              className="focus:ring-indigo-500 py-2 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-700 bg-gray-800 text-gray-400"
              required
            >
              <option value="">Select a disease</option>
              {diseases.map((disease, index) => (
                <option key={index} value={disease.name}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-1 w-full">
            <textarea
              name="content"
              placeholder="Write your content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="focus:ring-indigo-500 px-2 py-2 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-700 bg-gray-800 text-gray-200"
              rows="5"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoadingPost ? "Publishing..." : "Publish Post"}
              <Send className="ml-2 h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
      <div className="mt-3 mb-3">
        <UserBlogs />
      </div>
    </div>
  );
};

export default CreateBlog;
