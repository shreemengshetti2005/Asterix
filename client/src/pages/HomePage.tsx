import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { FilterBar } from "../components/FilterBar";
import PostCard from "../components/QuestionCard";
import { Pagination } from "../components/Pagination";
import { apiService } from "../services/api";
import type { Question } from "../services/api";

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const questionsPerPage = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getFilteredQuestions('newest');
        setQuestions(response.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch questions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionsUpdate = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setCurrentPage(1); // Reset to first page when filtering/searching
    setError(null);
  };

  const handleSearch = (query: string) => {
    // Search functionality is handled in FilterBar
    console.log('Search query:', query);
  };

  const handleFilterChange = (filter: string) => {
    // Filter functionality is handled in FilterBar
    console.log('Filter changed to:', filter);
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FilterBar 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onQuestionsUpdate={handleQuestionsUpdate}
        setIsLoading={setIsLoading}
      />

      <main className="container px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentQuestions.length > 0 ? (
                currentQuestions.map((question) => (
                  <PostCard
                    key={question.id}
                    question={question}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No questions found.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
   

      <footer className="border-t bg-muted/30 py-6 mt-12">
        <div className="container px-4 text-center text-muted-foreground">
          <p>
            &copy; 2024 StackIt. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage; 