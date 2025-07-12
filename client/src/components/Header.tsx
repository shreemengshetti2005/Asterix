import { useState } from "react";
import { Button } from "./ui/button";
import { Code2, Menu, X } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <a href="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-extrabold tracking-wide text-gray-800 hover:text-blue-700 transition-colors">
            StackIt
          </span>
        </a>

        {/* Desktop / Tablet Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            className="px-6 py-2 text-sm md:text-base rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            Login
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Slide-Down */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-inner border-t">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <Button
              variant="outline"
              className="w-full px-4 py-2 text-base rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
