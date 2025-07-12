import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  onQuestionsUpdate?: (questions: any[]) => void;
  setIsLoading?: (loading: boolean) => void;
}

export function FilterBar({ onSearch, onFilterChange, onQuestionsUpdate, setIsLoading }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else if (searchQuery === "") {
        // If search is cleared, load default questions
        handleFilterChange(selectedFilter);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    if (setIsLoading) setIsLoading(true);
    
    try {
      if (query.trim()) {
        const response = await apiService.searchQuestions(query);
        if (onQuestionsUpdate) {
          onQuestionsUpdate(response.questions || []);
        }
        if (onSearch) {
          onSearch(query);
        }
      } else {
        // If search is empty, load default questions based on current filter
        await handleFilterChange(selectedFilter);
      }
    } catch (error) {
      console.error('Error searching questions:', error);
      if (onQuestionsUpdate) {
        onQuestionsUpdate([]);
      }
    } finally {
      setIsSearching(false);
      if (setIsLoading) setIsLoading(false);
    }
  };

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);
    if (setIsLoading) setIsLoading(true);
    
    try {
      let questions: any[] = [];
      
      switch (filter) {
        case 'unanswered':
          const unansweredResponse = await apiService.getFilteredQuestions('unanswered');
          questions = unansweredResponse.questions || [];
          break;
        case 'oldest':
          const oldestResponse = await apiService.getFilteredQuestions('oldest');
          questions = oldestResponse.questions || [];
          break;
        case 'most-voted':
          const mostVotedResponse = await apiService.getFilteredQuestions('most-voted');
          questions = mostVotedResponse.questions || [];
          break;
        case 'most-answered':
          const mostAnsweredResponse = await apiService.getFilteredQuestions('most-answered');
          questions = mostAnsweredResponse.questions || [];
          break;
        case 'newest':
        default:
          const newestResponse = await apiService.getFilteredQuestions('newest');
          questions = newestResponse.questions || [];
          break;
      }
      
      if (onQuestionsUpdate) {
        onQuestionsUpdate(questions);
      }
      if (onFilterChange) {
        onFilterChange(filter);
      }
    } catch (error) {
      console.error('Error filtering questions:', error);
      if (onQuestionsUpdate) {
        onQuestionsUpdate([]);
      }
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Ask New Question Button */}
          <Link to="/ask">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2.5 rounded-lg font-medium flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Ask New Question
            </Button>
          </Link>

          {/* Filter Dropdown */}
          <div className="flex-shrink-0">
            <Select value={selectedFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full lg:w-[220px] border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 rounded-lg bg-white shadow-sm h-11">
                <SelectValue placeholder="Filter questions" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                <SelectItem value="newest" className="rounded-md">
                  Newest
                </SelectItem>
                <SelectItem value="oldest" className="rounded-md">
                  Oldest
                </SelectItem>
               
                <SelectItem value="unanswered" className="rounded-md">
                  Unanswered
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:max-w-md">
            <div className="relative">
              {isSearching ? (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isSearching ? "Searching..." : "Search questions, tags, or users..."}
                className={`pl-10 pr-4 py-2.5 border-2 transition-colors duration-200 rounded-lg bg-white shadow-sm text-gray-700 placeholder:text-gray-400 h-11 ${
                  isSearching 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                }`}
                disabled={isSearching}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
