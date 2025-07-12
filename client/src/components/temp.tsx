import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Bold, 
  Italic, 
  Link, 
  List, 
  Code, 
  Quote,
  ChevronRight,
  Menu,
  CheckCircle,
  Award,
  ChevronDown,
  ExternalLink,
  TrendingUp,
  Clock,
  MessageCircle,
  Eye,
  Edit3
} from 'lucide-react';
import { Header } from './Header';
import { apiService } from '../services/api';
import type { Question, Answer as ApiAnswer } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import RichTextEditor from './RichTextEditor';
import { CommentSection } from './CommentSection';
import { useAuth } from '../context/authContext';

function Temp() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [apiAnswers, setApiAnswers] = useState<ApiAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionVotes, setQuestionVotes] = useState(0);
  const [userVote, setUserVote] = useState<{ [key: string]: 'up' | 'down' | null }>({});
  const [answerText, setAnswerText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-upvoted' | 'most-downvoted'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [answerEditorMode, setAnswerEditorMode] = useState<'write' | 'preview'>('write');
  const ANSWERS_TO_SHOW = 2;
  
  // Add ref for the answer textarea
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const answersResponse = await apiService.getAnswersByQuestionId(parseInt(id));

        if (answersResponse.success) {
          setQuestion(answersResponse.question);
          setApiAnswers(answersResponse.answers || []);
          setQuestionVotes(answersResponse.question.upvotes);
        }
      } catch (error) {
        console.error('Error fetching question data:', error);
        setError('Failed to load question');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionData();
  }, [id]);

  const handleVote = async (type: 'question' | 'answer', id: string | number, direction: 'up' | 'down') => {
    const key = type === 'question' ? 'question' : `answer-${id}`;
    const currentVote = userVote[key];
    
    try {
      if (type === 'question' && question) {
        if (direction === 'up') {
          const response = await apiService.upvoteQuestion(question.id);
          if (response.success) {
            setQuestionVotes(response.question.upvotes);
            setUserVote(prev => ({ ...prev, [key]: direction }));
          }
        } else {
          const response = await apiService.downvoteQuestion(question.id);
          if (response.success) {
            setQuestionVotes(response.question.upvotes);
            setUserVote(prev => ({ ...prev, [key]: direction }));
          }
        }
      } else if (type === 'answer') {
        const answerId = id as number;
        if (direction === 'up') {
          const response = await apiService.upvoteAnswer(answerId);
          if (response.success) {
            // Update the answer votes in the local state
            setApiAnswers(prev => prev.map(answer => 
              answer.id === answerId 
                ? { ...answer, upvotes: answer.upvotes + 1 }
                : answer
            ));
            setUserVote(prev => ({ ...prev, [key]: direction }));
          } else if (response.error) {
            console.log('Vote error:', response.error);
            // You could show a toast notification here
            alert(response.error);
          }
        } else {
          const response = await apiService.downvoteAnswer(answerId);
          if (response.success) {
            // Update the answer votes in the local state
            setApiAnswers(prev => prev.map(answer => 
              answer.id === answerId 
                ? { ...answer, downvotes: answer.downvotes + 1 }
                : answer
            ));
            setUserVote(prev => ({ ...prev, [key]: direction }));
          } else if (response.error) {
            console.log('Vote error:', response.error);
            // You could show a toast notification here
            alert(response.error);
          }
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Handle network errors or other exceptions
      alert('Failed to vote. Please try again.');
    }
  };

  // Rich text formatting functions
  const insertMarkdown = (syntax: string) => {
    const textarea = answerTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = answerText.substring(start, end);

    let newText = "";
    switch (syntax) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        newText = `*${selectedText || "italic text"}*`;
        break;
      case "strikethrough":
        newText = `~~${selectedText || "strikethrough text"}~~`;
        break;
      case "code":
        newText = `\`${selectedText || "code"}\``;
        break;
      case "codeblock":
        newText = `\`\`\`\n${selectedText || "code block"}\n\`\`\``;
        break;
      case "link":
        newText = `[${selectedText || "link text"}](url)`;
        break;
      case "image":
        newText = `![${selectedText || "alt text"}](image-url)`;
        break;
      case "list":
        newText = `\n- ${selectedText || "list item"}`;
        break;
      case "orderedlist":
        newText = `\n1. ${selectedText || "list item"}`;
        break;
      case "quote":
        newText = `\n> ${selectedText || "quote text"}`;
        break;
      case "heading":
        newText = `\n## ${selectedText || "heading text"}`;
        break;
      case "table":
        newText = `\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n`;
        break;
    }

    const before = answerText.substring(0, start);
    const after = answerText.substring(end);
    const newAnswerText = before + newText + after;

    setAnswerText(newAnswerText);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const sortedAnswers = useMemo(() => {
    const sorted = [...apiAnswers].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most-upvoted':
          return b.upvotes - a.upvotes;
        case 'most-downvoted':
          return a.downvotes - b.downvotes;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [apiAnswers, sortBy]);

  const displayedAnswers = showAllAnswers ? sortedAnswers : sortedAnswers.slice(0, ANSWERS_TO_SHOW);
  const hasMoreAnswers = sortedAnswers.length > ANSWERS_TO_SHOW;

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'most-upvoted': return 'Most Upvoted';
      case 'most-downvoted': return 'Most Downvoted';
      default: return 'Newest First';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const renderAnswer = (answer: ApiAnswer) => (
    <div key={answer.id} className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 mb-4 last:mb-0">
      {/* Header Section - Author and Time */}
      <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {answer.answeredBy.username
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-gray-900 font-semibold text-sm truncate">{answer.answeredBy.username}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-xs font-medium">{formatTimeAgo(answer.createdAt)}</span>
            </div>
          </div>
      </div>

      {/* Content */}
      <div className="text-gray-600 text-sm leading-relaxed mb-3">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom styling for markdown elements
            p: ({children}) => <p className="mb-3">{children}</p>,
            strong: ({children}) => <strong className="font-bold">{children}</strong>,
            em: ({children}) => <em className="italic">{children}</em>,
            del: ({children}) => <del className="line-through">{children}</del>,
            code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-200 p-3 rounded mb-3 overflow-x-auto">{children}</pre>,
            a: ({children, href}) => <a href={href} className="text-blue-600 hover:underline">{children}</a>,
            ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
            li: ({children}) => <li>{children}</li>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-3">{children}</blockquote>,
            h1: ({children}) => <h1 className="text-2xl font-bold mb-3">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-bold mb-3">{children}</h3>,
            table: ({children}) => <table className="border-collapse border border-gray-300 mb-3 w-full">{children}</table>,
            th: ({children}) => <th className="border border-gray-300 px-3 py-2 bg-gray-100 font-bold">{children}</th>,
            td: ({children}) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
          }}
        >
          {answer.content}
        </ReactMarkdown>
      </div>

      {/* Action Bar - Votes */}
      <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleVote('answer', answer.id, 'up')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 ${
            userVote[`answer-${answer.id}`] === 'up'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{answer.upvotes}</span>
        </button>
        
        <button
          onClick={() => handleVote('answer', answer.id, 'down')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 ${
            userVote[`answer-${answer.id}`] === 'down'
              ? 'bg-red-50 text-red-500'
              : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500'
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{answer.downvotes}</span>
        </button>


      </div>

      {/* Comment Section */}
      <CommentSection 
        answerId={answer.id} 
        isLoggedIn={!!user} 
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-8">
            <p className="text-red-600">{error || 'Question not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span className="hover:text-blue-600 cursor-pointer">Questions</span>
          <ChevronRight size={16} />
          <span className="text-gray-900">Question #{id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Question Card */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 mb-6">
              {/* Header Section - Author and Time */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {question.askedBy?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-gray-900 font-semibold text-sm truncate">{question.askedBy?.username || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium whitespace-nowrap">{formatTimeAgo(question.createdAt)}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer mb-2 leading-tight transition-colors duration-200">
                {question.title}
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {question.content}
              </p>

              {/* Action Bar - Votes and Tags */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote('question', 0, 'up')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                      userVote.question === 'up'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">{questionVotes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote('question', 0, 'down')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                      userVote.question === 'down'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-2">
                {question.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Regular Answers Section */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {sortedAnswers.length} {sortedAnswers.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                
                {/* Sort Menu with Hamburger Icon */}
                <div className="relative">
                  
                  
                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        {[
                          { value: 'newest', label: 'Newest First' },
                          { value: 'oldest', label: 'Oldest First' },
                          { value: 'most-upvoted', label: 'Most Upvoted' },
                          { value: 'most-downvoted', label: 'Most Downvoted' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as any);
                              setShowSortMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                              sortBy === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Regular Answers */}
              {sortedAnswers.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {displayedAnswers.map(answer => renderAnswer(answer))}
                  </div>
                  
                  {/* Show More Answers Button */}
                  {hasMoreAnswers && !showAllAnswers && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <button
                        onClick={() => setShowAllAnswers(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 text-sm"
                      >
                        <span>Show {sortedAnswers.length - ANSWERS_TO_SHOW} More {sortedAnswers.length - ANSWERS_TO_SHOW === 1 ? 'Answer' : 'Answers'}</span>
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  )}
                  
                  {/* Show Less Button when all answers are displayed */}
                  {showAllAnswers && hasMoreAnswers && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <button
                        onClick={() => setShowAllAnswers(false)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-medium rounded-full border border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 transition-all duration-200 text-sm"
                      >
                        <span>Show Less</span>
                        <ChevronDown size={14} className="transform rotate-180" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No community answers yet. Be the first to help!</p>
                </div>
              )}
            </div>

            {/* Submit Your Answer */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Answer</h3>
              <RichTextEditor
                value={answerText}
                onChange={setAnswerText}
                placeholder="Write your answer here..."
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={async () => {
                    if (!answerText.trim() || !id) return;
                    try {
                      const response = await apiService.submitAnswer(parseInt(id), {
                        content: answerText
                      });
                      if (response.success) {
                        setAnswerText('');
                        // Refresh the answers
                        const answersResponse = await apiService.getAnswersByQuestionId(parseInt(id));
                        if (answersResponse.success) {
                          setApiAnswers(answersResponse.answers || []);
                        }
                      }
                    } catch (error) {
                      console.error('Error submitting answer:', error);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Temp;