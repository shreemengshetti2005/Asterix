import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "../components/postQuestion/post";
import { Header } from "../components/Header";
import { apiService } from "../services/api";
import type { QuestionData } from "../services/api";

const AskQuestionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleSubmit = async (data: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    try {
      const questionData: QuestionData = {
        title: data.title,
        content: data.description,
        tags: data.tags,
      };
      
      const response = await apiService.createQuestion(questionData);
      
      if (response.status === 200) {
        console.log("Question created successfully:", response.data?.question);
        setIsModalOpen(false);
        navigate("/");
      } else {
        console.error("Failed to create question:", response.message);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Error creating question:", error);
      const errorMessage = apiService.handleError(error);
      console.error("Error message:", errorMessage);
      // You could show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AskQuestionPage; 