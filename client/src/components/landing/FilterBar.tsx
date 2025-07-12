"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Plus, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function FilterBar() {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Filter Section */}
        <div className="py-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center">
            {/* Left Section - Ask Question Button */}
            <div className="flex-shrink-0">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Ask New Question
              </Button>
            </div>

            {/* Center Section - Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 lg:flex-initial">
              {/* Primary Filter */}
              <div className="flex-1 sm:flex-initial">
                <Select defaultValue="newest-unanswered">
                  <SelectTrigger className="w-full sm:w-[200px] h-11 border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-gray-200 shadow-xl">
                    <SelectItem
                      value="newest-unanswered"
                      className="rounded-md"
                    >
                      Newest Unanswered
                    </SelectItem>
                    <SelectItem value="newest" className="rounded-md">
                      Newest
                    </SelectItem>
                    <SelectItem value="most-answered" className="rounded-md">
                      Most Answered
                    </SelectItem>
                    <SelectItem value="most-voted" className="rounded-md">
                      Most Voted
                    </SelectItem>
                    <SelectItem value="unanswered" className="rounded-md">
                      Unanswered
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* More Options Dropdown */}
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-11 px-4 border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg bg-white hover:bg-gray-50"
                    >
                      <span className="hidden sm:inline mr-2">More</span>
                      <MoreHorizontal className="h-4 w-4 sm:hidden" />
                      <ChevronDown className="h-4 w-4 hidden sm:inline" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-lg shadow-xl"
                  >
                    <DropdownMenuItem className="rounded-md">
                      Sort by Date
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md">
                      Sort by Votes
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md">
                      Filter by Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md">
                      Advanced Search
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right Section - Search */}
            <div className="flex-1 lg:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions, tags, or users..."
                  className="pl-10 pr-12 h-11 border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg bg-white text-gray-700 placeholder:text-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded transition-colors hover:bg-gray-200">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-100 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">1,234</span>{" "}
                  questions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">567</span>{" "}
                  unanswered
                </span>
              </div>
            </div>

            {/* Additional Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
              <span>Last updated: 2 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
