"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";

export function FilterBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest-unanswered");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "Sort by:", sortBy);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 lg:py-5">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-4 md:hidden">
            {/* Ask Question Button - Mobile */}
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01]"
              onClick={() => console.log("Ask new question")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask New Question
            </Button>

            {/* Search Bar - Mobile */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
                <Input
                  placeholder="Search questions, tags, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-4 pr-12 h-12 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400 rounded-lg"
                />
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter - Mobile */}
            <div className="relative">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 px-4 flex items-center whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue className="text-gray-700 font-medium truncate" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <SelectItem
                    value="newest-unanswered"
                    className="rounded-md py-2.5 px-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="font-medium text-gray-700">
                      Newest Unanswered
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="newest"
                    className="rounded-md py-2.5 px-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="font-medium text-gray-700">Newest</span>
                  </SelectItem>
                  <SelectItem
                    value="most-answered"
                    className="rounded-md py-2.5 px-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="font-medium text-gray-700">
                      Most Answered
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="most-voted"
                    className="rounded-md py-2.5 px-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="font-medium text-gray-700">
                      Most Voted
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="unanswered"
                    className="rounded-md py-2.5 px-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="font-medium text-gray-700">
                      Unanswered
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-5 lg:gap-6">
            {/* Ask Question Button - Desktop */}
            <div className="flex-shrink-0">
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-12 px-6 lg:px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
                onClick={() => console.log("Ask new question")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask New Question
              </Button>
            </div>

            {/* Search Section - Desktop */}
            <div className="flex-1 max-w-2xl lg:max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        placeholder="Search questions, tags, or users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-5 lg:pl-6 pr-4 h-13 lg:h-14 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400 text-base rounded-l-xl"
                      />
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="p-2 lg:p-2.5">
                      <Button
                        onClick={handleSearch}
                        className="h-9 lg:h-10 w-9 lg:w-10 p-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <Search className="h-4 lg:h-5 w-4 lg:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter - Desktop */}
            <div className="flex-shrink-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 lg:h-13 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 px-4 flex items-center whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue className="text-gray-700 font-medium truncate" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm min-w-[220px]">
                  <SelectItem
                    value="newest-unanswered"
                    className="rounded-md py-3 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Newest Unanswered
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Questions without answers
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="newest"
                    className="rounded-md py-3 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Newest
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Recently posted questions
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="most-answered"
                    className="rounded-md py-3 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Most Answered
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Questions with most responses
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="most-voted"
                    className="rounded-md py-3 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Most Voted
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Highest rated questions
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="unanswered"
                    className="rounded-md py-3 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Unanswered
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Questions needing answers
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
