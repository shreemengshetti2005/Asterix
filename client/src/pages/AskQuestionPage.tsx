import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "../components/postQuestion/post";
import { Header } from "../components/Header";

const AskQuestionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleSubmit = (data: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    console.log("New question submitted:", data);
    // Here you would typically send the data to your backend
    // For now, we'll just close the modal and redirect
    setIsModalOpen(false);
    navigate("/");
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