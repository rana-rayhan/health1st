import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import LoadingState from "../LoadingState";
import { fetchPosts } from "../../toolkit/postSlice";
import SearchBar from "../SearchBar";
import FilterDropdown from "../FilterDropdown";

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, getMessage, isError } = useSelector(
    (state) => state.postData
  );

  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");

  useEffect(() => {
    if (posts?.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts?.length]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, searchQuery, selectedDisease]);

  const applyFilters = () => {
    const filtered = posts.filter((post) => {
      const titleMatch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const diseaseMatch = selectedDisease
        ? post.diseases.name
            .toLowerCase()
            .includes(selectedDisease.toLowerCase())
        : true;
      return titleMatch && diseaseMatch;
    });
    setFilteredPosts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (disease) => {
    setSelectedDisease(disease);
  };

  const RenderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isError) {
      return (
        <div className="text-white text-center p-4 bg-red-600 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p>
            {getMessage ||
              "We're having trouble loading the posts. Please try again later."}
          </p>
        </div>
      );
    }

    if (filteredPosts?.length === 0) {
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
        {filteredPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between gap-6 mb-4">
          <SearchBar onSearch={handleSearch} />
          <FilterDropdown onFilter={handleFilter} />
        </div>
        <RenderContent />
      </main>
    </div>
  );
};

export default Blogs;
