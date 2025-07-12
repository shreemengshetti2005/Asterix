import React, { useState, useMemo } from 'react';
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
  MessageCircle
} from 'lucide-react';
import { Header } from './Header';

interface Answer {
  id: number;
  content: string;
  codeExample?: string;
  votes: number;
  author: string;
  authorColor: string;
  timestamp: string;
  isExpert?: boolean;
  isVerified?: boolean;
}

function Temp() {
  const { id } = useParams<{ id: string }>();
  const [questionVotes, setQuestionVotes] = useState(5);
  const [userVote, setUserVote] = useState<{ [key: string]: 'up' | 'down' | null }>({});
  const [answerText, setAnswerText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-upvoted' | 'most-downvoted'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const ANSWERS_TO_SHOW = 2;

  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: 1,
      content: "You can use the CONCAT function in SQL to combine columns:",
      codeExample: "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;",
      votes: 3,
      author: "SQLExpert",
      authorColor: "bg-green-600",
      timestamp: "1 hour ago",
      isExpert: true,
      isVerified: true
    },
    {
      id: 2,
      content: "Alternative approach using the pipe operator (works in some SQL dialects):",
      codeExample: "SELECT first_name || ' ' || last_name AS full_name FROM users;",
      votes: 1,
      author: "DataGuru",
      authorColor: "bg-purple-600",
      timestamp: "30 minutes ago"
    },
    {
      id: 3,
      content: "For PostgreSQL, you can also use the CONCAT_WS function which handles NULL values better:",
      codeExample: "SELECT CONCAT_WS(' ', first_name, last_name) AS full_name FROM users;",
      votes: 2,
      author: "PostgresPro",
      authorColor: "bg-blue-600",
      timestamp: "45 minutes ago"
    },
    {
      id: 4,
      content: "In Microsoft SQL Server, you can use the + operator for string concatenation:",
      codeExample: "SELECT first_name + ' ' + last_name AS full_name FROM users;",
      votes: 4,
      author: "SQLServerDev",
      authorColor: "bg-red-600",
      timestamp: "2 hours ago"
    },
    {
      id: 5,
      content: "For Oracle databases, you can use the CONCAT function or the || operator:",
      codeExample: "SELECT CONCAT(CONCAT(first_name, ' '), last_name) AS full_name FROM users;\n-- OR --\nSELECT first_name || ' ' || last_name AS full_name FROM users;",
      votes: 0,
      author: "OracleExpert",
      authorColor: "bg-orange-600",
      timestamp: "3 hours ago"
    },
    {
      id: 6,
      content: "Don't forget to handle NULL values properly when concatenating. Here's a safe approach:",
      codeExample: "SELECT \n  CASE \n    WHEN first_name IS NULL AND last_name IS NULL THEN NULL\n    WHEN first_name IS NULL THEN last_name\n    WHEN last_name IS NULL THEN first_name\n    ELSE CONCAT(first_name, ' ', last_name)\n  END AS full_name\nFROM users;",
      votes: 7,
      author: "SafeCoder",
      authorColor: "bg-indigo-600",
      timestamp: "4 hours ago"
    },
    {
      id: 7,
      content: "For MySQL, you can also use the CONCAT_WS function which is very handy:",
      codeExample: "SELECT CONCAT_WS(' ', first_name, middle_name, last_name) AS full_name FROM users;",
      votes: 2,
      author: "MySQLMaster",
      authorColor: "bg-yellow-600",
      timestamp: "5 hours ago"
    },
    {
      id: 8,
      content: "If you're working with SQLite, the || operator is your best friend:",
      codeExample: "SELECT first_name || ' ' || last_name AS full_name FROM users;",
      votes: 1,
      author: "SQLiteFan",
      authorColor: "bg-gray-600",
      timestamp: "6 hours ago"
    }
  ]);

  const handleVote = (type: 'question' | 'answer', id: string | number, direction: 'up' | 'down') => {
    const key = type === 'question' ? 'question' : `answer-${id}`;
    const currentVote = userVote[key];
    
    if (type === 'question') {
      if (currentVote === direction) {
        setQuestionVotes(prev => prev + (direction === 'up' ? -1 : 1));
        setUserVote(prev => ({ ...prev, [key]: null }));
      } else if (currentVote === null) {
        setQuestionVotes(prev => prev + (direction === 'up' ? 1 : -1));
        setUserVote(prev => ({ ...prev, [key]: direction }));
      } else {
        setQuestionVotes(prev => prev + (direction === 'up' ? 2 : -2));
        setUserVote(prev => ({ ...prev, [key]: direction }));
      }
    } else {
      const answerId = id as number;
      if (currentVote === direction) {
        setAnswers(prev => prev.map(answer => 
          answer.id === answerId 
            ? { ...answer, votes: answer.votes + (direction === 'up' ? -1 : 1) }
            : answer
        ));
        setUserVote(prev => ({ ...prev, [key]: null }));
      } else if (currentVote === null) {
        setAnswers(prev => prev.map(answer => 
          answer.id === answerId 
            ? { ...answer, votes: answer.votes + (direction === 'up' ? 1 : -1) }
            : answer
        ));
        setUserVote(prev => ({ ...prev, [key]: direction }));
      } else {
        setAnswers(prev => prev.map(answer => 
          answer.id === answerId 
            ? { ...answer, votes: answer.votes + (direction === 'up' ? 2 : -2) }
            : answer
        ));
        setUserVote(prev => ({ ...prev, [key]: direction }));
      }
    }
  };

  const sortedAnswers = useMemo(() => {
    const regularAnswers = answers.filter(answer => !answer.isExpert && !answer.isVerified);
    
    const sorted = [...regularAnswers].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'most-upvoted':
          return b.votes - a.votes;
        case 'most-downvoted':
          return a.votes - b.votes;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [answers, sortBy]);

  const expertAnswers = answers.filter(answer => answer.isExpert || answer.isVerified);

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

  const renderAnswer = (answer: Answer, isExpert = false) => (
    <div key={answer.id} className={`group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 ${isExpert ? '' : 'mb-4 last:mb-0'}`}>
      {/* Header Section - Author and Time */}
      <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {answer.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-gray-900 font-semibold text-sm truncate">{answer.author}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-xs font-medium">{answer.timestamp}</span>
            </div>
            {(answer.isExpert || answer.isVerified) && (
              <div className="flex items-center space-x-1.5">
                {answer.isExpert && (
                  <div className="flex items-center space-x-1 bg-yellow-100 px-1.5 py-0.5 rounded-full">
                    <Award size={10} className="text-yellow-600" />
                    <span className="text-xs text-yellow-700 font-medium">Expert</span>
                  </div>
                )}
                {answer.isVerified && (
                  <>
                    <div className="flex items-center space-x-1 bg-green-100 px-1.5 py-0.5 rounded-full">
                      <CheckCircle size={10} className="text-green-600" />
                      <span className="text-xs text-green-700 font-medium">Verified</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-100 px-1.5 py-0.5 rounded-full">
                      <CheckCircle size={10} className="text-blue-600" />
                      <span className="text-xs text-blue-700 font-medium">Recommended Solution</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
      </div>

      {/* Content */}
      <div className="prose prose-gray max-w-none mb-3">
        <p className="text-gray-600 text-sm leading-relaxed mb-3">{answer.content}</p>
        {answer.codeExample && (
          <pre className="bg-gray-50 p-3 rounded-lg border-l-3 border-blue-500 text-xs overflow-x-auto">
            <code>{answer.codeExample}</code>
          </pre>
        )}
        {isExpert && (
          <p className="text-xs text-green-700 mt-2 bg-green-50 p-2 rounded-lg border border-green-200">
            This answer combines the first and last name with a space in between, creating a clean full name format.
          </p>
        )}
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
          <span className="text-xs font-semibold">{answer.votes}</span>
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
        </button>
      </div>
    </div>
  );

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
                    U1
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-gray-900 font-semibold text-sm truncate">user123</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium whitespace-nowrap">2 hours ago</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer mb-2 leading-tight transition-colors duration-200">
                How to join 2 columns in a data set to make a separate column in SQL? (ID: {id})
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                I am working the code for it but I am a beginner. An example would be greatly appreciated. I need to combine 2 columns consisting of last name and first name as a column for combined name.
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
                {['SQL', 'database', 'beginner'].map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Expert and Verified Answer Section */}
            {expertAnswers.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Expert & Verified Answer</h2>
                {expertAnswers.map(answer => renderAnswer(answer, true))}
              </div>
            )}

            {/* Regular Answers Section */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {sortedAnswers.length} {sortedAnswers.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                
                {/* Sort Menu with Hamburger Icon */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-medium text-gray-700"
                  >
                    <Menu size={16} />
                    <span>Sort by: {getSortLabel(sortBy)}</span>
                    <ChevronDown size={16} className={`transform transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
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
              
              {/* Rich Text Editor Toolbar */}
              <div className="border border-gray-300 rounded-xl">
                <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 rounded-t-xl">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Bold size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Italic size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Link size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <List size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Code size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Quote size={16} />
                  </button>
                </div>
                
                {/* Text Area */}
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full p-4 min-h-[200px] resize-none border-0 focus:outline-none focus:ring-0 rounded-b-xl"
                />
              </div>
              
              <div className="flex justify-end mt-4">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105">
                  Submit Answer
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-3">
            {/* Enhanced Related Questions */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 mb-5">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <TrendingUp size={18} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">Related Questions</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: "How to concatenate strings in MySQL?", votes: 12, answers: 5 },
                  { title: "SQL JOIN vs UNION differences", votes: 8, answers: 3 },
                  { title: "Best practices for column naming", votes: 15, answers: 7 },
                  { title: "Handling NULL values in SQL concatenation", votes: 6, answers: 2 }
                ].map((question, index) => (
                  <div key={index} className="group/item">
                    <a href="#" className="block p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="text-sm font-medium text-blue-700 group-hover/item:text-blue-800 mb-2 leading-relaxed">
                        {question.title}
                      </div>
                      <div className="flex items-center justify-between text-xs text-blue-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <ThumbsUp size={12} />
                            <span>{question.votes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle size={12} />
                            <span>{question.answers}</span>
                          </span>
                        </div>
                        <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-white rounded-xl py-2 hover:bg-blue-50">
                  show mo →
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