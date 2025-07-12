import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Code2, CheckCircle } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/authContext";
import {signup }from '../app.ts'

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  // const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password || !username) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    const success=await signup(email,password,username);
    // const success = await signup(email, password, username);
    if (success) {
      navigate("/");
    } else {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Code2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">Stack It</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Join the community
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Start asking, answering, and learning
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Ask unlimited questions</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Share your knowledge</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Build your reputation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Connect with experts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile header */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Stack It</h1>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Join the community and start learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              icon={<User className="w-5 h-5" />}
              autoComplete="username"
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              icon={<Lock className="w-5 h-5" />}
              autoComplete="new-password"
            />

            <div className="text-xs text-gray-500 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li className={password.length >= 6 ? "text-green-600" : ""}>
                  At least 6 characters
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                  One uppercase letter (recommended)
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                  One number (recommended)
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              // isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
