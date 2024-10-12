import React from "react";
import { Users, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About Health1st</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empowering individuals to share, learn, and support each other on
            their health journeys.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center">
            At Health1st, we believe in the power of community and shared
            knowledge. Our mission is to create a platform where individuals can
            openly discuss their health experiences, share valuable insights,
            and find support from others facing similar challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <FeatureCard
            icon={<Users size={40} />}
            title="Community-Driven"
            description="Connect with others who understand your health journey and share experiences."
          />
          <FeatureCard
            icon={<Heart size={40} />}
            title="Supportive Environment"
            description="Find encouragement and empathy from a caring community of users."
          />
          <FeatureCard
            icon={<MessageCircle size={40} />}
            title="Open Discussions"
            description="Engage in meaningful conversations about various health topics and treatments."
          />
          <FeatureCard
            icon={<TrendingUp size={40} />}
            title="Personal Growth"
            description="Learn from others' experiences and track your own health progress over time."
          />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-center">Our Story</h2>
          <p className="text-lg text-gray-300 mb-4">
            Health1st was born out of a simple idea: that sharing our health
            stories can be both therapeutic and informative. Founded in 2024 by
            a group of health advocates and tech enthusiasts, our platform aims
            to bridge the gap between medical information and personal
            experiences.
          </p>
          <p className="text-lg text-gray-300">
            We believe that while doctors and medical resources provide
            essential information, there's unique value in hearing from
            individuals who have walked similar paths. Health1st provides a
            space for these voices to be heard, fostering a community of
            support, understanding, and shared knowledge.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Join Our Community</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Whether you're looking to share your own health journey, learn from
            others, or offer support, Health1st welcomes you. Together, we can
            create a more informed, empathetic, and connected health community.
          </p>
          <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
