"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  X,
  Bold,
  Italic,
  Link,
  List,
  Code,
  Eye,
  Edit3,
  Hash,
  MessageSquare,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { apiService } from "../../services/api";
import RichTextEditor from '../RichTextEditor';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    tags: string[];
  }) => void;
}

const SUGGESTED_TAGS = [
  "beginner question",
  "technical help",
  "how-to",
  "troubleshooting",
  "best practices",
  "code review",
  "design feedback",
  "tutorial request",
  "tool recommendation",
  "workflow tips",
  "learning resources",
  "project help",
  "debugging",
  "performance",
  "accessibility",
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "natural" | "preview">(
    "write",
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const naturalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tagInput) {
      const filtered = SUGGESTED_TAGS.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(tag),
      );
      setFilteredSuggestions(filtered);
      setShowTagSuggestions(filtered.length > 0);
    } else {
      setShowTagSuggestions(false);
    }
  }, [tagInput, tags]);

  const insertMarkdown = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);

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

    const before = description.substring(0, start);
    const after = description.substring(end);
    const newDescription = before + newText + after;

    setDescription(newDescription);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const convertToMarkdown = async () => {
    if (naturalLanguageInput.trim()) {
      try {
        const response = await apiService.convertToMarkdown({ text: naturalLanguageInput });
        if (response.status === 200) {
          setDescription(response.data);
          setActiveTab("write");
        }
      } catch (error) {
        console.error('Error converting to markdown:', error);
        // Fallback to simple conversion
        const converted = naturalLanguageInput
          .split("\n\n")
          .map((paragraph) => paragraph.trim())
          .filter((p) => p)
          .join("\n\n");

        setDescription(converted);
        setActiveTab("write");
      }
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleAIClassification = async () => {
    try {
      const content = `${title} ${description}`;
      if (!content.trim()) return;

      const response = await apiService.getAITags({ text: content });
      if (response.status === 200 && response.data) {
        // Add suggested tags that aren't already present
        const newTags = response.data.filter((tag) => !tags.includes(tag));
        if (newTags.length > 0) {
          const tagsToAdd = newTags.slice(0, 5 - tags.length); // Ensure we don't exceed 5 tags
          setTags([...tags, ...tagsToAdd]);
        }
      }
    } catch (error) {
      console.error('Error getting AI tags:', error);
      // Fallback to simple keyword matching
      const content = `${title} ${description}`.toLowerCase();
      const suggestedTags = [];

      if (content.includes("how") || content.includes("help") || content.includes("question")) {
        suggestedTags.push("beginner question");
      }
      if (content.includes("code") || content.includes("programming") || content.includes("debug")) {
        suggestedTags.push("technical help");
      }
      if (content.includes("tutorial") || content.includes("learn") || content.includes("guide")) {
        suggestedTags.push("how-to");
      }
      if (content.includes("error") || content.includes("issue") || content.includes("problem")) {
        suggestedTags.push("troubleshooting");
      }
      if (content.includes("best") || content.includes("practice") || content.includes("recommend")) {
        suggestedTags.push("best practices");
      }
      if (content.includes("review") || content.includes("feedback")) {
        suggestedTags.push("code review");
      }

      const newTags = suggestedTags.filter((tag) => !tags.includes(tag));
      if (newTags.length > 0) {
        const tagsToAdd = newTags.slice(0, 5 - tags.length);
        setTags([...tags, ...tagsToAdd]);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "," && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, tags });
    // Reset form
    setTitle("");
    setDescription("");
    setNaturalLanguageInput("");
    setTags([]);
    setTagInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="create-post-modal max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white border-0">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Ask a Question
                </h2>
                <p className="text-gray-600 text-sm">
                  Get help from the community
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-700"
                >
                  Question Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="create-post-modal-input text-base sm:text-lg h-10 sm:h-12 rounded-xl w-full border border-gray-300 px-3 py-2"
                  placeholder="What's your question?"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Question Details
                </label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your question in detail..."
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tags
                </label>

                <div className="relative">
                  <div className="create-post-modal-tag-container flex flex-wrap gap-2 p-3 rounded-xl min-h-12 w-full border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="create-post-modal-tag rounded-full border-0 bg-blue-100 text-blue-800 px-3 py-1 text-sm flex items-center gap-1 animate-in slide-in-from-top-1 duration-200"
                      >
                        <span className="text-xs">#</span>
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="h-4 w-4 p-0 ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors duration-200"
                          title="Remove tag"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <input
                      ref={tagInputRef}
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onFocus={() =>
                        setShowTagSuggestions(filteredSuggestions.length > 0)
                      }
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicking on them
                        setTimeout(() => setShowTagSuggestions(false), 200);
                      }}
                      className="create-post-modal-tag-input flex-1 min-w-32 p-0 h-6 border-0 outline-none bg-transparent text-sm"
                      placeholder={tags.length === 0 ? "Add tags (press Enter or comma to add)..." : "Add more tags..."}
                      disabled={tags.length >= 5}
                    />
                  </div>
                  
                  {tags.length >= 5 && (
                    <p className="text-xs text-gray-500 mt-1">Maximum 5 tags allowed</p>
                  )}
                </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAIClassification}
                        disabled={!title.trim() && !description.trim()}
                        className="create-post-modal-button text-xs sm:text-sm px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Sparkles size={16} />
                        Auto-tag with AI
                      </button>
                      <span className="text-xs text-gray-500">
                        {tags.length}/5 tags
                      </span>
                    </div>
                  </div>

                  {/* Tag Suggestions */}
                  {showTagSuggestions && (
                    <div className="create-post-modal-suggestions absolute top-full left-0 right-0 mt-1 rounded-xl z-10 max-h-48 overflow-y-auto w-full bg-white border border-gray-200 shadow-lg">
                      <div className="p-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Suggested tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {filteredSuggestions.map((tag, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addTag(tag)}
                              className="create-post-modal-suggestion-btn h-7 text-xs rounded-full px-3 py-1 border border-gray-300 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="create-post-modal-button rounded-xl font-semibold px-8 py-3 bg-green-600 text-white hover:bg-green-700"
                >
                  Ask Question
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
