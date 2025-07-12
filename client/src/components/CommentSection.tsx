import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, X, User, ChevronDown, ChevronUp } from 'lucide-react';
import { apiService } from '../services/api';
import type { Comment } from '../services/api';
import RichTextEditor from './RichTextEditor';

interface CommentSectionProps {
  answerId: number;
  isLoggedIn: boolean;
  onCommentCountChange?: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ answerId, isLoggedIn, onCommentCountChange }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only fetch comments when they are shown
  const fetchComments = async () => {
    if (!showComments) return;
    
    try {
      setIsLoading(true);
      const response = await apiService.getComments(answerId);
      if (response.success) {
        const commentsList = response.comments || [];
        setComments(commentsList);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments when showComments changes
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;

    try {
      setIsSubmitting(true);
      const response = await apiService.addComment(answerId, { content: newComment });
      if (response.success) {
        const updatedComments = [response.comment, ...comments];
        setComments(updatedComments);
        setNewComment('');
        setShowAddComment(false);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {/* Comments Header with Toggle Button */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comments</span>
          {showComments ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        {isLoggedIn && (
          <button
            onClick={() => setShowAddComment(!showAddComment)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="h-3 w-3" />
            <span>Add Comment</span>
          </button>
        )}
      </div>

      {/* Add Comment Form */}
      {showAddComment && isLoggedIn && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Add a Comment</h4>
            <button
              onClick={() => setShowAddComment(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <RichTextEditor
            value={newComment}
            onChange={setNewComment}
            placeholder="Write your comment here..."
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowAddComment(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      )}

      {/* Comments List - Only shown when showComments is true */}
      {showComments && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No comments yet</p>
              {isLoggedIn && (
                <p className="text-xs text-gray-400 mt-1">Be the first to comment!</p>
              )}
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {comment.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}; 