import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Code2, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-extrabold tracking-wide text-gray-800 hover:text-blue-700 transition-colors">
            StackIt
          </span>
        </Link>

        {/* Desktop / Tablet Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="px-6 py-2 text-sm md:text-base rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  className="px-6 py-2 text-sm md:text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
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

            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-base rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full px-4 py-2 text-base rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="w-full px-4 py-2 text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
