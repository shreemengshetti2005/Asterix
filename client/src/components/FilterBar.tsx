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

export function FilterBar() {
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Ask New Question Button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2.5 rounded-lg font-medium flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Ask New Question
          </Button>

          {/* Filter Dropdown */}
          <div className="flex-shrink-0">
            <Select defaultValue="newest-unanswered">
              <SelectTrigger className="w-full lg:w-[220px] border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 rounded-lg bg-white shadow-sm h-11">
                <SelectValue placeholder="Filter questions" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                <SelectItem value="newest-unanswered" className="rounded-md">
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

          {/* Search Input */}
          <div className="relative flex-1 lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions, tags, or users..."
                className="pl-10 pr-4 py-2.5 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 rounded-lg bg-white shadow-sm text-gray-700 placeholder:text-gray-400 h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
