import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type PostCardProps = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  upvotes: number;
  downvotes: number;
  answers: number;
  timeAgo: string;
};

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  tags,
  author,
  upvotes,
  downvotes,
  answers,
  timeAgo,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className="group bg-white rounded-3xl p-4 sm:p-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 border border-gray-50 hover:border-blue-100">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                {author}
              </span>
              <span className="text-gray-300 font-medium">•</span>
              <span className="text-gray-500 font-medium">{timeAgo}</span>
            </div>
          </div>
          {answers > 0 && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {answers} {answers === 1 ? "Answer" : "Answers"}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4 cursor-pointer hover:text-blue-600 transition-colors duration-300 line-clamp-2 group-hover:text-blue-700">
          {title}
        </h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
        <div className="flex items-center space-x-4 mb-5">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isLiked
                ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <ThumbsUp
              className={`h-4 w-4 transition-transform duration-300 ${
                isLiked ? "scale-110" : ""
              }`}
            />
            <span className="font-semibold text-sm">
              {isLiked ? upvotes + 1 : upvotes}
            </span>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isDisliked
                ? "bg-red-500 text-white shadow-lg shadow-red-200"
                : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <ThumbsDown
              className={`h-4 w-4 transition-transform duration-300 ${
                isDisliked ? "scale-110" : ""
              }`}
            />
            <span className="font-semibold text-sm">
              {isDisliked ? downvotes + 1 : downvotes}
            </span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Move sample data outside component to prevent recreation on every render
const samplePosts = [
  {
    id: "post-1",
    title:
      "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine both the names into a single column...",
    tags: ["SQL", "Database", "Beginner"],
    author: "John Doe",
    upvotes: 15,
    downvotes: 2,
    answers: 5,
    timeAgo: "2 hours ago",
  },
  {
    id: "post-2",
    title: "React useEffect cleanup function not working as expected",
    description:
      "I'm trying to clean up my useEffect but the cleanup function doesn't seem to be called when the component unmounts. I have a subscription that should be cancelled but it's still running...",
    tags: ["React", "JavaScript", "Hooks"],
    author: "Sarah Wilson",
    upvotes: 23,
    downvotes: 1,
    answers: 8,
    timeAgo: "4 hours ago",
  },
  {
    id: "post-3",
    title: "Best practices for API error handling in Node.js",
    description:
      "What are the industry standard approaches for handling errors in REST APIs? I want to make sure I'm following best practices for error responses, status codes, and error messaging...",
    tags: ["Node.js", "API", "Error-Handling"],
    author: "Mike Chen",
    upvotes: 31,
    downvotes: 0,
    answers: 12,
    timeAgo: "1 day ago",
  },
];

const PostCardDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {(() => {
          console.log("Rendering PostCardDemo...");
          console.log("Sample posts:", samplePosts);
          return null;
        })()}
        {samplePosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      <div className="text-center text-gray-500">
        <p className="text-sm">No more posts to show</p>
      </div>
    </div>
  );
};

export default PostCardDemo;
