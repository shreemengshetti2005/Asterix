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

  const convertToMarkdown = () => {
    if (naturalLanguageInput.trim()) {
      // Simple conversion - in a real app, you'd use AI to convert natural language to markdown
      const converted = naturalLanguageInput
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter((p) => p)
        .join("\n\n");

      setDescription(converted);
      setActiveTab("write");
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleAIClassification = () => {
    // Simulate AI classification based on title and description
    const content = `${title} ${description}`.toLowerCase();
    const suggestedTags = [];

    // Simple keyword matching - in a real app, this would use AI
    if (
      content.includes("how") ||
      content.includes("help") ||
      content.includes("question")
    ) {
      suggestedTags.push("beginner question");
    }
    if (
      content.includes("code") ||
      content.includes("programming") ||
      content.includes("debug")
    ) {
      suggestedTags.push("technical help");
    }
    if (
      content.includes("tutorial") ||
      content.includes("learn") ||
      content.includes("guide")
    ) {
      suggestedTags.push("how-to");
    }
    if (
      content.includes("error") ||
      content.includes("issue") ||
      content.includes("problem")
    ) {
      suggestedTags.push("troubleshooting");
    }
    if (
      content.includes("best") ||
      content.includes("practice") ||
      content.includes("recommend")
    ) {
      suggestedTags.push("best practices");
    }
    if (content.includes("review") || content.includes("feedback")) {
      suggestedTags.push("code review");
    }

    // Add suggested tags that aren't already present
    const newTags = suggestedTags.filter((tag) => !tags.includes(tag));
    if (newTags.length > 0) {
      setTags([...tags, ...newTags.slice(0, 3)]); // Limit to 3 suggestions
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
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
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Ask a Question
              </h2>
              <p className="text-gray-600 text-sm">
                Get help from the community
              </p>
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

                <div className="space-y-4">
                  <div className="grid w-full grid-cols-3 h-auto bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`create-post-modal-tab flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 rounded-md transition-colors ${
                        activeTab === "write"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Edit3 size={16} />
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("natural")}
                      className={`create-post-modal-tab flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 rounded-md transition-colors ${
                        activeTab === "natural"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <MessageSquare size={16} />
                      Natural Language
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`create-post-modal-tab flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 rounded-md transition-colors ${
                        activeTab === "preview"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                  </div>

                  {activeTab === "write" && (
                    <div className="space-y-0">
                      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                        {/* Markdown Toolbar */}
                        <div className="create-post-modal-toolbar flex items-center gap-1 p-2 flex-wrap overflow-x-auto bg-gray-50 border-b border-gray-200">
                          <button
                            type="button"
                            onClick={() => insertMarkdown("bold")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Bold"
                          >
                            <Bold size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("italic")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Italic"
                          >
                            <Italic size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("strikethrough")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Strikethrough"
                          >
                            <span className="text-sm font-bold">S̶</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("code")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Code"
                          >
                            <Code size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("codeblock")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Code Block"
                          >
                            <span className="text-xs font-mono">{"{ }"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("link")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Link"
                          >
                            <Link size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("image")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Image"
                          >
                            <ImageIcon size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("list")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="List"
                          >
                            <List size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("orderedlist")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Numbered List"
                          >
                            <span className="text-sm font-bold">1.</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("quote")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Quote"
                          >
                            <span className="text-lg font-bold">"</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("heading")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Heading"
                          >
                            <span className="text-sm font-bold">H</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("table")}
                            className="create-post-modal-toolbar-btn h-8 w-8 p-0 rounded hover:bg-gray-200 flex items-center justify-center"
                            title="Table"
                          >
                            <span className="text-sm font-bold">⊞</span>
                          </button>
                        </div>

                        <textarea
                          ref={textareaRef}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="create-post-modal-textarea min-h-40 border-0 rounded-none w-full px-3 py-2 resize-none focus:outline-none"
                          placeholder="Describe your question in detail..."
                          required
                        />
                      </div>

                      <div className="flex justify-end items-center mt-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Hash size={14} className="mr-1" />
                          Markdown supported
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "natural" && (
                    <div className="space-y-4 mt-2">
                      <textarea
                        ref={naturalTextareaRef}
                        value={naturalLanguageInput}
                        onChange={(e) =>
                          setNaturalLanguageInput(e.target.value)
                        }
                        className="create-post-modal-input min-h-40 resize-none rounded-xl w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your question in natural language..."
                      />

                      <div className="flex justify-between items-center mt-4">
                        <button
                          type="button"
                          onClick={convertToMarkdown}
                          disabled={!naturalLanguageInput.trim()}
                          className="create-post-modal-button rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Convert to Markdown
                        </button>

                        <div className="flex items-center text-xs text-gray-500">
                          <MessageSquare size={14} className="mr-1" />
                          Natural language input
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "preview" && (
                    <div className="space-y-0 mt-2">
                      <div className="create-post-modal-preview p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="prose prose-gray prose-sm max-w-none">
                          {description ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {description}
                            </ReactMarkdown>
                          ) : (
                            <em className="text-gray-500">
                              Nothing to preview
                            </em>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end items-center mt-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye size={14} className="mr-1" />
                          Live preview
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tags
                </label>

                <div className="relative">
                  <div className="create-post-modal-tag-container flex flex-wrap gap-2 p-3 rounded-xl min-h-12 w-full border border-gray-300 bg-white">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="create-post-modal-tag rounded-full border-0 bg-blue-100 text-blue-800 px-3 py-1 text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="h-4 w-4 p-0 ml-1 text-blue-600 hover:text-blue-800 hover:bg-transparent rounded-full flex items-center justify-center"
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
                      className="create-post-modal-tag-input flex-1 min-w-32 p-0 h-6 border-0 outline-none bg-transparent"
                      placeholder={tags.length === 0 ? "Add tags..." : ""}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      onClick={handleAIClassification}
                      disabled={!title.trim() && !description.trim()}
                      className="create-post-modal-button text-xs sm:text-sm px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      Auto-tag with AI
                    </button>
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
                              className="create-post-modal-suggestion-btn h-7 text-xs rounded-full px-3 py-1 border border-gray-300 hover:bg-gray-100"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
