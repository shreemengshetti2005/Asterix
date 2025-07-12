import { useState } from "react";
import { Header } from "../components/Header";
import { FilterBar } from "../components/FilterBar";
import PostCard from "../components/QuestionCard";
import { Pagination } from "../components/Pagination";
import { mockQuestions } from "../data/mockQuestions";

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(mockQuestions.length / questionsPerPage);

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = mockQuestions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FilterBar />

      
        <div className="space-y-6">
          <PostCard />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
   

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