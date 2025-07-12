import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { apiService } from "../services/api";
import type { Question } from "../services/api";

type PostCardProps = {
  question: Question;
};

const PostCard: React.FC<PostCardProps> = ({ question }) => {
  const [localUpvotes, setLocalUpvotes] = useState(question.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(question.downvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const navigate = useNavigate();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVoting) return;

    try {
      setIsVoting(true);
      const response = await apiService.upvoteQuestion(question.id);
      
      if (response.success) {
        setLocalUpvotes(response.question.upvotes);
        setLocalDownvotes(response.question.downvotes);
        setUserVote('up');
      }
    } catch (error) {
      console.error('Error upvoting question:', error);
      // Handle error (could show a toast notification)
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVoting) return;

    try {
      setIsVoting(true);
      const response = await apiService.downvoteQuestion(question.id);
      
      if (response.success) {
        setLocalUpvotes(response.question.upvotes);
        setLocalDownvotes(response.question.downvotes);
        setUserVote('down');
      }
    } catch (error) {
      console.error('Error downvoting question:', error);
      // Handle error (could show a toast notification)
    } finally {
      setIsVoting(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/question/${question.id}`);
  };

  const authorName = question.askedBy?.username || question.user?.username || 'Unknown';
  const answerCount = question.answers?.length || question.answerCount || 0;

  return (
    <div 
      className="group bg-white rounded-3xl p-4 sm:p-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 border border-gray-50 hover:border-blue-100 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {authorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                {authorName}
              </span>
              <span className="text-gray-300 font-medium">•</span>
              <span className="text-gray-500 font-medium">{formatTimeAgo(question.createdAt)}</span>
            </div>
          </div>
          {answerCount > 0 && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4 cursor-pointer hover:text-blue-600 transition-colors duration-300 line-clamp-2 group-hover:text-blue-700">
          {question.title}
        </h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
          {question.content}
        </p>
        <div className="flex items-center space-x-4 mb-5">
          <button
            onClick={handleUpvote}
            disabled={isVoting}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === 'up'
                ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <ThumbsUp
              className={`h-4 w-4 transition-transform duration-300 ${
                userVote === 'up' ? "scale-110" : ""
              }`}
            />
            <span className="font-semibold text-sm">
              {localUpvotes}
            </span>
          </button>
          <button
            onClick={handleDownvote}
            disabled={isVoting}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === 'down'
                ? "bg-red-500 text-white shadow-lg shadow-red-200"
                : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <ThumbsDown
              className={`h-4 w-4 transition-transform duration-300 ${
                userVote === 'down' ? "scale-110" : ""
              }`}
            />
            <span className="font-semibold text-sm">
              {localDownvotes}
            </span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {question.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
