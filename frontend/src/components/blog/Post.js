import React from "react";
import { User, MessageCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <div className="bg-black border border-blue-950 rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:border-blue-800 hover:scale-105">
      <Link
        to={`/blog/${post.title}`}
        state={post}
        className=" text-sm text-green-700"
      >
        <header className="bg-gray-900 p-4 text-white">
          <h2 className="text-xl font-bold text-slate-200 truncate">
            {post.title}
          </h2>
          <div className="flex items-center text-slate-400 mt-2 text-sm">
            <User size={14} className="mr-1" />
            <span className="mr-2  truncate">{post.author.name}</span>
            <Calendar size={14} className="mr-1" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        <main className="p-4">
          <p className="text-gray-500 text-sm line-clamp-2">{post.content}</p>

          <div className="mt-4 flex justify-between items-center">
            <span className="inline-block bg-gray-800 text-gray-400 px-4 py-1 rounded-full text-xs font-semibold">
              {post.diseases.name}
            </span>
            <div className="flex items-center text-gray-500">
              <MessageCircle size={16} className="mr-1" />
              <span className="text-sm">{post.comments.length}</span>
            </div>
          </div>
        </main>
      </Link>
    </div>
  );
};

export default Post;
